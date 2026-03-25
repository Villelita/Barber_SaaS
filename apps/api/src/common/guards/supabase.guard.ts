import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';

/**
 * Guard básico para validar existencia de Sesión / JWT desde Supabase.
 * En un escenario real verificaría el JWT decodificado por @nestjs/passport con estragia JWT.
 */
@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('No se ha proporcionado un token de sesión');
    }

    try {
      // Aquí integrariamos @supabase/supabase-js para verificar o la estrategia de Passport
      // request.user = { id: '...', esteticaId: '...' }
      return true;
    } catch {
      throw new UnauthorizedException('Token de sesión no válido');
    }
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
