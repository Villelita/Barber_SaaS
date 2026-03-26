import { IsDateString, IsNotEmpty, IsString, IsEnum, IsOptional } from 'class-validator';
import { EstadoCita } from '@prisma/client';

export class CreateCitaDto {
  @IsDateString()
  @IsNotEmpty()
  fechaHoraInicio!: string;

  @IsDateString()
  @IsNotEmpty()
  fechaHoraFin!: string;

  @IsString()
  @IsNotEmpty()
  clienteId!: string;

  @IsString()
  @IsNotEmpty()
  empleadoId!: string;

  @IsString()
  @IsNotEmpty()
  servicioId!: string;

  @IsEnum(EstadoCita)
  @IsOptional()
  estado?: EstadoCita;
}
