import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServicioDto } from './dto/create-servicio.dto';
import { UpdateServicioDto } from './dto/update-servicio.dto';

@Injectable()
export class ServiciosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createServicioDto: CreateServicioDto, tenantId: string) {
    if (!tenantId) throw new NotFoundException('Tenant ID no especificado guardando servicio');
    
    return this.prisma.servicio.create({
      data: {
        ...createServicioDto,
        esteticaId: tenantId,
      },
    });
  }

  async findAll() {
    // esteticaId es inyectado automáticamente por la Extensión de Prisma
    return this.prisma.servicio.findMany();
  }

  async findOne(id: string) {
    const servicio = await this.prisma.servicio.findUnique({
      where: { id },
    });
    if (!servicio) throw new NotFoundException(`Servicio ${id} no encontrado`);
    return servicio;
  }

  async update(id: string, updateServicioDto: UpdateServicioDto) {
    await this.findOne(id); // Valida que exista (y pertenezca al tenant automáticamente)
    return this.prisma.servicio.update({
      where: { id },
      data: updateServicioDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.servicio.delete({
      where: { id },
    });
  }
}
