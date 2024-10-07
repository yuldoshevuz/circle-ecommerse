import { Injectable } from '@nestjs/common';
import { BrandRepository } from 'src/repositories/brand.repository';
import { IBrand } from 'src/repositories/interfaces/brand.interface';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { CreateBrandDto } from './dto/create-brand.dto';

@Injectable()
export class BrandService {
  constructor(private readonly brandRepository: BrandRepository) {}

  async findAll(): Promise<IBrand[]> {
    const brands = await this.brandRepository.findAll();
    return brands;
  }

  async findBySlug(slug: string): Promise<IBrand> {
    const brand = await this.brandRepository.findOne(
      { slug },
      'Brand not found with this slug',
    );
    return brand;
  }

  async create(data: CreateBrandDto): Promise<IBrand> {
    const newBrand = await this.brandRepository.create(data);
    return newBrand;
  }

  async update(id: string, data: UpdateBrandDto): Promise<IBrand> {
    const updated = await this.brandRepository.update(id, data);
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.brandRepository.delete(id);
  }
}
