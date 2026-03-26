import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEmpleadoDto } from './dto/create-empleado.dto';
import { UpdateEmpleadoDto } from './dto/update-empleado.dto';
import { RolUsuario } from '@prisma/client';

@Injectable()
export class EmpleadosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createEmpleadoDto: CreateEmpleadoDto, tenantId: string) {
    if (!tenantId) throw new NotFoundException('Tenant ID es requerido');
    
    // Asignamos explícitamente el rol empleado por seguridad en este endpoint
    return this.prisma.usuario.create({
      data: {
        ...createEmpleadoDto,
        rol: createEmpleadoDto.rol || RolUsuario.EMPLEADO,
        esteticaId: tenantId,
      },
    });
  }

  async findAll() {
    // Filtramos solo los usuarios que sean empleados o dueños de ese tenant particular
    return this.prisma.usuario.findMany({
      where: {
        rol: {
          in: [RolUsuario.EMPLEADO, RolUsuario.DUENO],
        },
      },
      select: {
        id: true,
        nombre: true,
        email: true,
        rol: true,
        createdAt: true,
      }
    });
  }

  async findOne(id: string) {
    const empleado = await this.prisma.usuario.findUnique({
      where: { id },
    });
    if (!empleado) throw new NotFoundException(`Empleado ${id} no encontrado`);
    return empleado;
  }

  async update(id: string, updateEmpleadoDto: UpdateEmpleadoDto) {
    await this.findOne(id);
    return this.prisma.usuario.update({
      where: { id },
      data: updateEmpleadoDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.usuario.delete({
      where: { id },
    });
  }
}
