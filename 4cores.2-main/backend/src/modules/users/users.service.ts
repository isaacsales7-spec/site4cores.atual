import { Injectable, OnModuleInit, OnModuleDestroy, InternalServerErrorException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super();
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async findByEmail(email: string) {
    return this.user.findUnique({
      where: { email },
    });
  }

  async createUser(data: any) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return this.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: (data.role || 'EMPLOYEE').toUpperCase(),
      },
    });
  }

  async findAllEmployees() {
    try {
      return await this.user.findMany({
        where: {
          role: 'EMPLOYEE' as any,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      });
    } catch (error) {
      console.error('--- ERRO NO BANCO DE DADOS (PRISMA) ---');
      console.error(error);
      throw new InternalServerErrorException('Falha ao consultar banco de dados');
    }
  }

  async deleteEmployee(id: string) {
    return this.user.delete({
      where: { id },
    });
  }
}