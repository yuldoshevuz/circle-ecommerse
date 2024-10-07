import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { NavbarModelType } from '@prisma/client';
import { Request } from 'express';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CategoryRepository } from 'src/repositories/category.repository';
import { ProductRepository } from 'src/repositories/product.repository';

@Injectable()
export class CheckExistsModel implements CanActivate {
  constructor(
		private readonly productRepository: ProductRepository,
		private readonly categoryRepository: CategoryRepository,
	) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest<Request>();
		const { id } = request.params as { id: string };
		const path = request.path;
		

    if (path.includes('product')) {
      await this.productRepository.findById(id);
      return true;
    } else if (path.includes('category')) {
      await this.categoryRepository.findById(id);
      return true;
    }

		throw new NotFoundException('Model not found');
  }
}
