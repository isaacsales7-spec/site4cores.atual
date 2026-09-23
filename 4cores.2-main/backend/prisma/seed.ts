import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('sua_senha_admin_aqui', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@4cores.com' },
    update: {},
    create: {
      name: 'Administrador',
      email: 'admin@4cores.com',
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });

  console.log('Administrador criado com sucesso:', admin.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });