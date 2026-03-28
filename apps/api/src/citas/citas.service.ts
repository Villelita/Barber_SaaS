import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCitaDto } from './dto/create-cita.dto';
import { UpdateCitaDto } from './dto/update-cita.dto';
import { EstadoCita } from '@prisma/client';

@Injectable()
export class CitasService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCitaDto: CreateCitaDto, tenantId: string) {
    if (!tenantId) throw new NotFoundException('Se requiere Tenant ID (esteticaId)');

    return this.prisma.cita.create({
      data: {
        ...createCitaDto,
        fechaHoraInicio: new Date(createCitaDto.fechaHoraInicio),
        fechaHoraFin: new Date(createCitaDto.fechaHoraFin),
        estado: createCitaDto.estado || EstadoCita.PENDIENTE,
        esteticaId: tenantId,
      },
    });
  }

  async findAll() {
    return this.prisma.cita.findMany({
      include: {
        cliente: { select: { nombre: true, email: true } },
        empleado: { select: { nombre: true, email: true } },
        servicio: { select: { nombre: true, precio: true } },
      },
      orderBy: { fechaHoraInicio: 'asc' },
    });
  }

  async findOne(id: string) {
    const cita = await this.prisma.cita.findUnique({
      where: { id },
      include: {
        cliente: { select: { nombre: true, email: true } },
        empleado: { select: { nombre: true, email: true } },
        servicio: { select: { nombre: true, precio: true, duracionMinutos: true } },
      },
    });
    if (!cita) throw new NotFoundException(`Cita ${id} no encontrada`);
    return cita;
  }

  async update(id: string, updateCitaDto: UpdateCitaDto) {
    await this.findOne(id);
    const dto = updateCitaDto as any;
    return this.prisma.cita.update({
      where: { id },
      data: {
        ...updateCitaDto,
        fechaHoraInicio: dto.fechaHoraInicio ? new Date(dto.fechaHoraInicio) : undefined,
        fechaHoraFin: dto.fechaHoraFin ? new Date(dto.fechaHoraFin) : undefined,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.cita.delete({
      where: { id },
    });
  }

  // --- Motor de Disponibilidad ---
  async getDisponibilidad(fecha: string, servicioId: string, tenantId: string, empleadoId?: string) {
    if (!tenantId) throw new NotFoundException('Tenant ID requerido');

    // 1. Obtener la duración del servicio
    const servicio = await this.prisma.servicio.findUnique({
      where: { id: servicioId, esteticaId: tenantId }
    });
    if (!servicio) throw new NotFoundException('Servicio no encontrado');
    const duracion = servicio.duracionMinutos;

    // Rango del día solicitado (00:00 a 23:59)
    const startOfDay = new Date(`${fecha}T00:00:00.000Z`);
    const endOfDay = new Date(`${fecha}T23:59:59.999Z`);

    // 2. Obtener empleados disponibles (Filtro base)
    let empleados = await this.prisma.usuario.findMany({
      where: {
        esteticaId: tenantId,
        rol: 'EMPLEADO',
        ...(empleadoId ? { id: empleadoId } : {})
      }
    });

    if (empleados.length === 0) return []; // No hay empleados

    // 3. Obtener todas las citas confirmadas/pendientes de esos empleados ese día
    const citasDelDia = await this.prisma.cita.findMany({
      where: {
        esteticaId: tenantId,
        empleadoId: { in: empleados.map(e => e.id) },
        fechaHoraInicio: { gte: startOfDay, lte: endOfDay },
        estado: { not: 'CANCELADA' }
      }
    });

    // 4. Configuración del Horario Laboral (Hardcodeado V1: 09:00 a 18:00)
    const openTimeStr = '09:00';
    const closeTimeStr = '18:00';

    const [openH, openM] = openTimeStr.split(':').map(Number);
    const [closeH, closeM] = closeTimeStr.split(':').map(Number);

    const openTime = new Date(startOfDay);
    openTime.setUTCHours(openH, openM, 0, 0);

    const closeTime = new Date(startOfDay);
    closeTime.setUTCHours(closeH, closeM, 0, 0);

    // 5. Generar slots de 15 minutos iterando por cada bloque
    const availableSlots: string[] = [];
    let currentSlot = new Date(openTime);

    while (currentSlot.getTime() + (duracion * 60000) <= closeTime.getTime()) {
      const slotEnd = new Date(currentSlot.getTime() + (duracion * 60000));

      // Verificar si hay AL MENOS UN empleado libre en este gap
      let hasAvailableEmployee = false;

      for (const emp of empleados) {
        // Citas de este empleado que se solapan con currentSlot -> slotEnd
        const conflict = citasDelDia.find(cita => {
          if (cita.empleadoId !== emp.id) return false;
          return (currentSlot < cita.fechaHoraFin && slotEnd > cita.fechaHoraInicio);
        });

        if (!conflict) {
          hasAvailableEmployee = true;
          break; // Con uno que pueda, habilitamos el slot
        }
      }

      if (hasAvailableEmployee) {
        const hh = String(currentSlot.getUTCHours()).padStart(2, '0');
        const mm = String(currentSlot.getUTCMinutes()).padStart(2, '0');
        availableSlots.push(`${hh}:${mm}`);
      }

      currentSlot = new Date(currentSlot.getTime() + 900000);
    }

    return availableSlots;
  }
}
