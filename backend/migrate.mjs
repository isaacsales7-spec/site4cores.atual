import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';

const prisma = new PrismaClient();

const SUPABASE_URL = 'https://vfjfvzqhvoyjfqupdtyu.supabase.co';

// Cole dentro das aspas a sua chave VITE_SUPABASE_ANON_KEY completa (a que começa por eyJ...)
const SUPABASE_KEY = 'sb_secret_qbQd9pTPDtfcnC0Z8IDSmw_d75BMxiD'; 

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function migrate() {
  console.log('A ler produtos do Prisma local...');
  const products = await prisma.product.findMany();

  if (products.length === 0) {
    console.log('Nenhum produto encontrado na base local.');
    return;
  }

  console.log(`Encontrados ${products.length} produtos. A enviar para o Supabase...`);

  const formattedProducts = products.map(({ id, createdAt, updatedAt, ...rest }) => rest);

  const { data, error } = await supabase
    .from('products')
    .insert(formattedProducts);

  if (error) {
    console.error('Erro ao migrar:', error);
  } else {
    console.log('Sucesso! Produtos migrados para o Supabase Cloud.');
  }
}

migrate().finally(() => prisma.$disconnect());