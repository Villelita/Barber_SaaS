import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, Query } from '@nestjs/common';
import { CitasService } from './citas.service';
import { CreateCitaDto } from './dto/create-cita.dto';
import { UpdateCitaDto } from './dto/update-cita.dto';
import { GetDisponibilidadDto } from './dto/get-disponibilidad.dto';
import { SupabaseAuthGuard } from '../common/guards/supabase.guard';
import { TenantInterceptor } from '../common/interceptors/tenant.interceptor';
import { CurrentTenant } from '../common/decorators/tenant.decorator';

@Controller('citas')
@UseInterceptors(TenantInterceptor)
export class CitasController {
  constructor(private readonly citasService: CitasService) {}

  @Post()
  create(
    @Body() createCitaDto: CreateCitaDto,
    @CurrentTenant() tenantId: string
  ) {
    return this.citasService.create(createCitaDto, tenantId);
  }

  @Get()
  @UseGuards(SupabaseAuthGuard)
  findAll() {
    return this.citasService.findAll();
  }

  @Get('disponibilidad')
  getDisponibilidad(
    @Query() query: GetDisponibilidadDto,
    @CurrentTenant() tenantId: string
  ) {
    return this.citasService.getDisponibilidad(
      query.fecha, 
      query.servicioId, 
      tenantId, 
      query.empleadoId
    );
  }

  @Get(':id')
  @UseGuards(SupabaseAuthGuard)
  findOne(@Param('id') id: string) {
    return this.citasService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(SupabaseAuthGuard)
  update(@Param('id') id: string, @Body() updateCitaDto: UpdateCitaDto) {
    return this.citasService.update(id, updateCitaDto);
  }

  @Delete(':id')
  @UseGuards(SupabaseAuthGuard)
  remove(@Param('id') id: string) {
    return this.citasService.remove(id);
  }
}
