import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CreateTag, ITag, UpdateTag } from './interfaces/tag.interface';
import { CategoryRepository } from './category.repository';

@Injectable()
export class TagRepository {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async findAll(where?: Prisma.TagWhereInput): Promise<ITag[]> {
    const tags = await this.prismaService.tag.findMany({
      where,
      include: { products: true },
    });

    if (!tags.length) throw new NotFoundException('Tags not available now');

    return tags;
  }

  async findOne(
    where?: Prisma.TagWhereInput,
    errorMessage?: string,
  ): Promise<ITag> {
    const tag = await this.prismaService.tag.findFirst({
      where,
      include: { products: true },
    });

    if (!tag) throw new NotFoundException(errorMessage || 'Tag not found');

    return tag;
  }

  async findById(id: string, errorMessage?: string): Promise<ITag> {
    return await this.findOne(
      { id },
      errorMessage || 'Tag not found with this id. ID: ' + id,
    );
  }

  async create(data: CreateTag): Promise<ITag> {
    const newTag = await this.prismaService.tag.create({
      data: { ...data, slug: this.categoryRepository.slugger(data.title) },
      include: { products: true },
    });

    return newTag;
  }

  async update(id: string, data: UpdateTag): Promise<ITag> {
    await this.findOne({ id }, 'Tag not found with this id');

    const updatedTag = await this.prismaService.tag.update({
      where: { id },
      data: {
        ...data,
        slug: data.title && this.categoryRepository.slugger(data.title),
      },
      include: { products: true },
    });

    return updatedTag;
  }

  async delete(id: string): Promise<void> {
    await this.findOne({ id }, 'Tag not found with this id');
    await this.prismaService.tag.delete({ where: { id } });
  }
}
