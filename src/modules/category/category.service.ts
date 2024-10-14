import { Injectable } from '@nestjs/common';
import { CategoryResponseDto } from './dto/category-response.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryRepository } from 'src/repositories/category.repository';
import { ICategory } from 'src/repositories/interfaces/category.interface';
import { NavbarModelType } from '@prisma/client';

@Injectable()
export class CategoryService {
  constructor(
    private readonly categoryRepository: CategoryRepository
  ) {}

  async findAll(): Promise<CategoryResponseDto[]> {
    const categories = await this.categoryRepository.findAll({ parent_id: null });
    return categories.map((category) => this.formatResponse(category));
  }

  async findBySlug(slug: string): Promise<CategoryResponseDto> {
    const category = await this.categoryRepository.findBySlug(slug, 'Category not found with this slug');
    return this.formatResponse(category);
  }

  async create(dto: CreateCategoryDto): Promise<CategoryResponseDto> {
    const newCategory = await this.categoryRepository.create(dto);
		return this.formatResponse(newCategory);
  }

  async update(
    id: string,
    dto: UpdateCategoryDto,
  ): Promise<CategoryResponseDto> {
    const updatedCategory = await this.categoryRepository.update(id, dto);
		return this.formatResponse(updatedCategory);
  }

  async delete(id: string): Promise<void> {
    await this.categoryRepository.delete(id);
  }

  private formatResponse(category: ICategory): CategoryResponseDto {
    return {
      id: category.id,
      title: category.title,
			slug: category.slug,
			is_featured: category.is_featured,
      images: category.images.map(({ id, path }) => ({ id, path: process.env.BASE_URL + '/images/' + path })),
      children: category.children.map((item) => ({
        id: item.id,
				title: item.title,
				slug: item.slug,
				type: NavbarModelType['categories'],
				images: item.images.map(({ id, path }) => ({ id, path: process.env.BASE_URL + '/images/' + path }))
      })),
      products: category.products.map(product => ({
				id: product.id,
				title: product.title,
				price: product.stocks[0].price,
				brand: {
					id: product.brand.id,
					title: product.brand.title,
					slug: product.brand.slug,
				},
				images: product.images.map(({ id, path }) => ({ id, path: process.env.BASE_URL + '/images/' + path })),
				tags: product.tags.map(({ id, title, slug }) => ({ id, title, slug, type: NavbarModelType.tags })),
			})),
    };
  }
}
