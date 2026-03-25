import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';

/**
 * Intercepta las solicitudes entrantes para extraer el Tenant ID
 * ya sea desde los headers (ej: x-tenant-id) o el subdominio.
 * Lo inyecta en el request object para ser usado por PrismaService.
 */
@Injectable()
export class TenantInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    
    // Suponemos que el tenantId viene en el header 'x-tenant-id' o en el Supabase JWT (request.user)
    const tenantId = request.headers['x-tenant-id'] || (request.user && request.user.esteticaId);
    
    if (tenantId) {
      request.tenantId = tenantId;
    }

    return next.handle();
  }
}
