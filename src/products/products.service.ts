import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common/dto';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(ProductsService.name);

  onModuleInit() {
    this.$connect();
    this.logger.log('Database connected');
  }

  async create(createProductDto: CreateProductDto) {
    const { name, price } = createProductDto;

    const product = await this.product.create({
      data: {
        name: name,
        price: price,
      },
    });

    return product;
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    const totalPages = await this.product.count();
    const lastPage = Math.ceil(totalPages / limit);

    const products = await this.product.findMany({
      take: limit,
      skip: (page - 1) * limit,
    });

    const response = {
      data: products,
      meta: {
        page,
        nextPage: page + 1,
        limit,
        total: totalPages,
        lastPage,
      },
    };

    return response;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product ${updateProductDto}`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
