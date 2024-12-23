import {
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common/dto';
import { RpcException } from '@nestjs/microservices';

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

    const totalPages = await this.product.count({ where: { available: true } });
    const lastPage = Math.ceil(totalPages / limit);

    const products = await this.product.findMany({
      take: limit,
      skip: (page - 1) * limit,
      where: {
        available: true,
      },
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

  async findOne(id: number) {
    const product = await this.product.findUnique({
      where: {
        id: id,
        available: true,
      },
    });

    if (!product) {
      throw new RpcException(`Product #${id} not found`);
    }

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const { id: _id, ...rest } = updateProductDto;

    await this.findOne(id);

    const updatedProduct = await this.product.update({
      where: { id },
      data: rest,
    });

    return { id: _id, ...updatedProduct };
  }

  async remove(id: number) {
    await this.findOne(id);

    const deletedProduct = await this.product.update({
      where: { id },
      data: {
        available: false,
      },
    });

    return deletedProduct;
  }
}
