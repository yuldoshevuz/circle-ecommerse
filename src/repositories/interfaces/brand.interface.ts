import { Prisma } from '@prisma/client';
import { CreateBrandDto } from 'src/modules/brand/dto/create-brand.dto';
import { UpdateBrandDto } from 'src/modules/brand/dto/update-brand.dto';

export type IBrand = Prisma.BrandGetPayload<{
  include: { products: true };
}>;

export interface CreateBrand extends CreateBrandDto {}

export interface UpdateBrand extends UpdateBrandDto {}