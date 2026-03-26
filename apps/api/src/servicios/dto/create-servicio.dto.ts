import { IsNotEmpty, IsString, IsOptional, IsNumber, IsPositive } from 'class-validator';

export class CreateServicioDto {
  @IsNotEmpty()
  @IsString()
  nombre!: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  duracionMinutos!: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  precio!: number;
}
