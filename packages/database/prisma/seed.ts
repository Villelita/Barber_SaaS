import { PrismaClient, RolUsuario } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando Seeding de la Base de Datos...');

  // 1. Crear Tenant Principal (La primera Estética)
  const estetica = await prisma.estetica.upsert({
    where: { subdominio: 'admin' },
    update: {},
    create: {
      nombre: 'Vintage Barber (Sede Central)',
      subdominio: 'admin',
      colorPrimario: '#14b8a6', // Teal 500
    },
  });

  console.log(`✅ Tenant creado: ${estetica.nombre}`);

  // 2. Crear Super Administrador (Tú)
  const admin = await prisma.usuario.upsert({
    where: { email: 'admin@barbersaas.com' },
    update: {},
    create: {
      email: 'admin@barbersaas.com',
      nombre: 'Super Administrador',
      rol: RolUsuario.SUPER_ADMIN,
      esteticaId: estetica.id, 
    },
  });

  console.log(`✅ Admin creado: ${admin.email}`);

  // 3. Crear un Servicio de Prueba
  await prisma.servicio.create({
    data: {
      nombre: 'Corte Clásico + Perfilado de Barba',
      duracionMinutos: 45,
      precio: 350.00,
      esteticaId: estetica.id,
    }
  });

  console.log(`✅ Servicio de prueba registrado.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
