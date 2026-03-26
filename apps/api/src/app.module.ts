import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SupabaseModule } from './supabase/supabase.module';
import { AuthModule } from './auth/auth.module';
import { ServiciosModule } from './servicios/servicios.module';
import { EmpleadosModule } from './empleados/empleados.module';
import { CitasModule } from './citas/citas.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Hace que env variables estén en toda la api
    }),
    SupabaseModule,
    AuthModule,
    ServiciosModule,
    EmpleadosModule,
    CitasModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
