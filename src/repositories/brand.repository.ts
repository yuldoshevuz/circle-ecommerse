import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CreateBrand, IBrand, UpdateBrand } from './interfaces/brand.interface';
import { CategoryRepository } from './category.repository';

@Injectable()
export class BrandRepository {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async findAll(where?: Prisma.BrandWhereInput): Promise<IBrand[]> {
    const brands = await this.prismaService.brand.findMany({
      where,
      orderBy: { created_at: 'desc' },
      include: { products: true },
    });

    if (!brands.length) throw new NotFoundException('Brands not available now');

    return brands;
  }

  async findOne(
    where?: Prisma.BrandWhereInput,
    errorMessage?: string,
  ): Promise<IBrand> {
    const brand = await this.prismaService.brand.findFirst({
      where,
      include: { products: true },
    });

    if (!brand) throw new NotFoundException(errorMessage || 'Brand not found');

    return brand;
  }

  async findById(id: string, errorMessage?: string) {
    return await this.findOne(
      { id },
      errorMessage || 'Brand not found with thid id. ID: ' + id,
    );
  }

  async create(data: CreateBrand): Promise<IBrand> {
    const newBrand = await this.prismaService.brand.create({
      data: { ...data, slug: this.categoryRepository.slugger(data.title) },
      include: { products: true },
    });

    return newBrand;
  }

  async update(id: string, data: UpdateBrand): Promise<IBrand> {
    await this.findOne({ id }, 'Brand not found with this id');

    const updatedBrand = await this.prismaService.brand.update({
      where: { id },
      data: {
        ...data,
        slug: data.title
          ? this.categoryRepository.slugger(data.title)
          : undefined,
      },
      include: { products: true },
    });

    return updatedBrand;
  }

  async delete(id: string): Promise<void> {
    await this.findOne({ id });
    await this.prismaService.brand.delete({ where: { id } });
  }
}
