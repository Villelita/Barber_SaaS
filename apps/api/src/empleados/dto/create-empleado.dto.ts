import { IsEmail, IsNotEmpty, IsString, IsOptional, IsEnum } from 'class-validator';
import { RolUsuario } from '@prisma/client';

export class CreateEmpleadoDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsNotEmpty()
  @IsString()
  nombre!: string;

  @IsOptional()
  @IsEnum(RolUsuario)
  rol?: RolUsuario;
}
