import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private readonly logger = new Logger(SupabaseService.name);
  private supabaseClient: SupabaseClient;

  constructor(private readonly configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('NEXT_PUBLIC_SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY');

    if (!supabaseUrl || !supabaseKey) {
      this.logger.warn('Faltan variables de entorno para Supabase. Verifica NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY.');
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
