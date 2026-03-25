import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private readonly logger = new Logger(SupabaseService.name);
  private supabaseClient: SupabaseClient;

  constructor(private readonly configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      this.logger.warn('Faltan variables de entorno SUPABASE_URL o SUPABASE_KEY. El cliente de Supabase no se inicializará correctamente.');
    }

    this.supabaseClient = createClient(supabaseUrl || 'http://localhost', supabaseKey || 'public-anon-key', {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  public getClient(): SupabaseClient {
    return this.supabaseClient;
  }
}
