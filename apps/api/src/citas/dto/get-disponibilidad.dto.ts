import { IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class GetDisponibilidadDto {
  @IsNotEmpty()
  @IsDateString()
  fecha!: string;

  @IsNotEmpty()
  @IsString()
  servicioId!: string;

  @IsOptional()
  @IsString()
  empleadoId?: string;
}
