import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';

const prisma = new PrismaClient();

const SUPABASE_URL = 'https://vfjfvzqhvoyjfqupdtyu.supabase.co';
// Cole aqui a chave service_role (SECRET) do Supabase
const SUPABASE_SERVICE_ROLE_KEY = 'sb_secret_qbQd9pTPDtfcnC0Z8IDSmw_d75BMxiD'; 

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const TEMPORARY_PASSWORD = 'SenhaProvisoria123!';

async function migrateUsers() {
  console.log('🔄 Lendo utilizadores do banco local (SQLite / Prisma)...');

  try {
    const localUsers = await prisma.user.findMany();
    console.log(`📋 Encontrados ${localUsers.length} utilizador(es) no banco local.\n`);

    for (const user of localUsers) {
      console.log(`⏳ Migrando: ${user.name} (${user.email}) - Cargo: ${user.role}...`);

      // Cria a conta via Auth Admin (sem limite de taxa e já confirmada)
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: user.email,
        password: TEMPORARY_PASSWORD,
        email_confirm: true,
        user_metadata: {
          full_name: user.name,
          role: user.role,
        },
      });

      if (authError) {
        console.error(`⚠️ Erro Auth (${user.email}):`, authError.message);
      } else {
        console.log(`  └─ Criado no Auth com sucesso.`);
      }

      const supabaseUserId = authData?.user?.id || user.id;

      // Insere/Atualiza na tabela 'users'
      const { error: dbError } = await supabase.from('users').upsert({
        id: supabaseUserId,
        name: user.name,
        email: user.email,
        role: user.role,
      });

      if (dbError) {
        console.error(`❌ Erro Tabela 'users' (${user.email}):`, dbError.message);
      } else {
        console.log(`✅ ${user.name} guardado na tabela 'users'!`);
      }

      console.log('--------------------------------------------------');
    }

    console.log('\n🎉 Migração de utilizadores concluída com sucesso!');
  } catch (err) {
    console.error('❌ Erro inesperado:', err);
  } finally {
    await prisma.$disconnect();
  }
}

migrateUsers();