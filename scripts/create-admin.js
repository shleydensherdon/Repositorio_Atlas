const bcrypt = require('bcryptjs');
const { prisma } = require('./prisma-client');

async function main() {
  const passwordHash = await bcrypt.hash('Admin123', 10);

  const user = await prisma.user.upsert({
    where: { email: 'admin@atlasmaterials.com' },
    update: { passwordHash },
    create: {
      name: 'Administrador Atlas',
      email: 'admin@atlasmaterials.com',
      passwordHash,
      role: 'ADMIN',
    },
  });

  console.log(`✓ Utilizador admin pronto: ${user.email}`);
  console.log(`  Password: Admin123`);

  // Create singleton settings if not exists
  await prisma.setting.upsert({
    where: { id: 'singleton' },
    update: {},
    create: {
      id: 'singleton',
      companyName: 'Atlas Materials',
      whatsappNumber: '258874438819',
      contactEmail: 'comercial@atlasmaterials.com',
      contactPhone: '+258 87 443 8819',
      address: 'Avenida Principal, Maputo, Moçambique',
    },
  });

  console.log('✓ Definições globais configuradas');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
