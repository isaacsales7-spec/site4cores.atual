import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class ProductsService {
  findAll() {
    return prisma.product.findMany();
  }

  createProduct(data: {
    name: string;
    price: number | string;
    description?: string;
    stock?: number | string;
    image?: string;
    category?: string;
  }) {
    const parsedPrice = Number(String(data.price).replace(',', '.'));
    return prisma.product.create({
      data: {
        name: data.name,
        price: isNaN(parsedPrice) ? 0 : parsedPrice,
        description: data.description,
        image: data.image || null,
        category: data.category || 'Suprimentos',
        stock: data.stock ? Number(data.stock) : 0,
      },
    });
  }

  async toggleFeatured(id: string) {
    const product = await prisma.product.findUnique({ where: { id: String(id) } });
    if (!product) {
      throw new NotFoundException('Produto não encontrado');
    }

    return prisma.product.update({
      where: { id: String(id) },
      data: { isFeatured: !product.isFeatured },
    });
  }

  deleteProduct(id: string) {
    return prisma.product.delete({ where: { id: String(id) } });
  }
}