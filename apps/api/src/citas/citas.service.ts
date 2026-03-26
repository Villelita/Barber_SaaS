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
}
