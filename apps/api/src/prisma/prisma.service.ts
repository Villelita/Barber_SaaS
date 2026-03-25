import { Injectable, OnModuleInit, OnModuleDestroy, Scope, Inject } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { REQUEST } from '@nestjs/core';

@Injectable({ scope: Scope.REQUEST })
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor(@Inject(REQUEST) private request: any) {
    super();
    
    // Extensión de Prisma para aislar datos Multi-tenant automáticamente
    if (this.request?.tenantId) {
      this.$extends({
        query: {
          $allModels: {
            async $allOperations({ model, operation, args, query }) {
              const skipTenantModels = ['Estetica', 'Usuario']; // Modelos que quiza no filtres directamente o tienen lógica custom
              
              if (!skipTenantModels.includes(model)) {
                // Inyectar condition de tenant
                args.where = { ...args.where, esteticaId: request.tenantId };
              }
              return query(args);
            },
          },
        },
      });
    }
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
