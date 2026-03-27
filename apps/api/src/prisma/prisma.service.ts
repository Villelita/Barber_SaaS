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
              const skipTenantModels = ['Estetica', 'Usuario'];
              
              if (!skipTenantModels.includes(model)) {
                // Si la operación tiene 'where' (busqueda, update, delete)
                if (['findFirst', 'findMany', 'findUnique', 'update', 'updateMany', 'delete', 'deleteMany', 'count', 'aggregate', 'groupBy'].includes(operation)) {
                  (args as any).where = { ...(args as any).where, esteticaId: request.tenantId };
                }
                // Si es creación, inyectamos en 'data' si no existe ya
                if (['create', 'createMany'].includes(operation)) {
                  (args as any).data = { ...(args as any).data, esteticaId: request.tenantId };
                }
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
