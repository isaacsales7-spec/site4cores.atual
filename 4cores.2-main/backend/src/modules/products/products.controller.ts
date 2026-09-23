import { Controller, Get, Post, Delete, Patch, Body, Param, Inject } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(
    @Inject(ProductsService)
    private readonly productsService: ProductsService,
  ) {}

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Post()
  create(
    @Body()
    body: {
      name: string;
      price: number | string;
      description?: string;
      stock?: number | string;
      image?: string;
      category?: string;
    },
  ) {
    return this.productsService.createProduct(body);
  }

  @Patch(':id/featured')
  toggleFeatured(@Param('id') id: string) {
    return this.productsService.toggleFeatured(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.deleteProduct(id);
  }
}