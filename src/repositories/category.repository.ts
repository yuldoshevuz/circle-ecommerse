import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { isUUID } from 'class-validator';
import { UpdateCategoryDto } from 'src/modules/category/dto/update-category.dto';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { NavbarModelType, Prisma } from '@prisma/client';
import { ICategory } from './interfaces/category.interface';
import { CreateCategoryDto } from 'src/modules/category/dto/create-category.dto';

@Injectable()
export class CategoryRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(where?: Prisma.CategoryWhereInput): Promise<ICategory[]> {
    if (where?.id && !isUUID(where.id, 'all'))
      throw new BadRequestException('Invalid ID');

    const categories = await this.prismaService.category.findMany({
      where,
      include: this.include
    });

    if (!categories.length)
      throw new NotFoundException('Categories no available');

    return categories;
  }

  async findOne(
    where: Prisma.CategoryWhereInput,
    errorMessage?: string,
  ): Promise<ICategory> {
    if (where?.id && !isUUID(where.id, 'all'))
      throw new BadRequestException('Invalid ID');

    const category = await this.prismaService.category.findFirst({
      where,
  		include: this.include
    });

    if (!category)
      throw new NotFoundException(errorMessage || 'Category not found');

    return category;
  }

  async findById(id: string, errorMessage?: string): Promise<ICategory> {
    return await this.findOne({ id }, errorMessage || 'Category not found with this id. ID: ' + id);
  }

  async findBySlug(slug: string, errorMessage?: string): Promise<ICategory> {
    return await this.findOne({ slug }, errorMessage || 'Category not found with this slug. SLUG: ' + slug);
  }

  async create(data: CreateCategoryDto): Promise<ICategory> {
    if (data.parentId) await this.findById(data.parentId, 'Parent category no available with this id. ID: ' + data.parentId);

    const newCategory = await this.prismaService.category.create({
      data: {
        title: data.title,
        description: data.description,
        slug: this.slugger(data.title),
        parent_id: data.parentId || null,
        images: {
          createMany: {
            data: data.images?.map((item) => ({
              model_type: NavbarModelType['categories'],
              path: item.path,
            })),
          },
        },
      },
      include: this.include,
    });

    return newCategory;
  }

  async update(id: string, data: UpdateCategoryDto): Promise<ICategory> {
    await this.findById(id, 'Category not found with this id');
    const { title, description, images, parentId } = data;

		if (parentId) await this.findById(parentId, 'Parent category no available with this id');

    const updatedCategory = await this.prismaService.category.update({
      where: { id },
  		include: this.include,
      data: {
        title,
        slug: title && this.slugger(title),
        description,
        parent_id: parentId || null,
        images: {
          createMany: {
            data: images?.map((item) => ({
              model_type: NavbarModelType['categories'],
              path: item.path,
            })),
          },
        },
      }
    });

    return updatedCategory;
  }

  async delete(id: string): Promise<void> {
    await this.findById(id, 'Category not found with this id');
    await this.prismaService.category.delete({ where: { id } });
  }

  private get include() {
    return {
      images: true,
      children: {
        include: { images: true },
      },
      products: {
        include: {
          brand: true,
          images: true,
          stocks: true,
          tags: true,
        },
      },
    };
  }

  public slugger(title: string) {
    return (
      title.toLocaleLowerCase().replaceAll(' ', '-').replaceAll("'", '') +
      '-' +
      Date.now()
    );
  }
}
