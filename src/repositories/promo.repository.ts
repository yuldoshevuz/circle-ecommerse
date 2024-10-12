import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CreatePromo, IPromo } from './interfaces/promo.interface';
import { ProductRepository } from './product.repository';

@Injectable()
export class PromoRepository {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly productRepository: ProductRepository,
  ) {}

  async findAll(
    where?: Prisma.PromoWhereInput,
    limit?: number,
  ): Promise<IPromo[]> {
    const promos = await this.prismaService.promo.findMany({
      where,
      take: limit,
      orderBy: { created_at: 'desc' },
      include: this.include,
    });

    if (!promos.length) throw new NotFoundException('Promos not available now');

    return promos;
  }

  async findOne(where?: Prisma.PromoWhereInput): Promise<IPromo> {
    const promo = await this.prismaService.promo.findFirst({
      where,
      include: this.include,
    });

    if (!promo) throw new NotFoundException('Promo not found');

    return promo;
  }

  async create(data: CreatePromo): Promise<IPromo> {
    await this.productRepository.findById(
      data.product_id,
      'Product not found with this id',
    );

    const existsPromo = await this.prismaService.promo.findFirst({
      where: { product_id: data.product_id },
    });

    if (existsPromo)
      throw new BadRequestException('Promo already exists with this product');

    const newPromo = await this.prismaService.promo.create({
      data: { ...data, image: data.image || null },
      include: this.include,
    });

    return newPromo;
  }

  async delete(where?: Prisma.PromoWhereInput): Promise<void> {
    const existsPromo = await this.findOne(where);
    await this.prismaService.promo.delete({
      where: { id: existsPromo.id },
    });
  }

  get include() {
    return {
      product: {
        include: { brand: true, stocks: true, images: true },
      },
    };
  }
}
