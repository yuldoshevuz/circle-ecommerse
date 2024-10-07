import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import {
  CreateAttribute,
  IAttribute,
  UpdateAttribute,
} from './interfaces/attribute.interface';
import { Prisma } from '@prisma/client';

@Injectable()
export class AttributeRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(where?: Prisma.AttributeWhereInput): Promise<IAttribute[]> {
    const attributes = await this.prismaService.attribute.findMany({
      where,
      include: { values: true },
    });

    if (!attributes.length)
      throw new NotFoundException('Attributes not available now');

    return attributes;
  }

  async findOne(
    where?: Prisma.AttributeWhereInput,
    errorMessage?: string,
  ): Promise<IAttribute> {
    const attribute = await this.prismaService.attribute.findFirst({
      where,
      include: { values: true },
    });

    if (!attribute)
      throw new NotFoundException(errorMessage || 'Attribute not found');

    return attribute;
  }

  async findById(id: string, errorMessage?: string): Promise<IAttribute> {
    return await this.findOne(
      { id },
      errorMessage || 'Attribute not found with this id. ID: ' + id,
    );
  }

  async create(data: CreateAttribute): Promise<IAttribute> {
    const newAttribute = await this.prismaService.attribute.create({
      data: {
        title: data.title,
        values: {
          createMany: {
            data: data.values.map((value) => ({ value })),
          },
        },
      },
      include: { values: true },
    });

    return newAttribute;
  }

  async update(id: string, data: UpdateAttribute): Promise<IAttribute> {
    const existsAttribute = await this.findById(id);

    const updatedAttribute = await this.prismaService.attribute.update({
      where: { id },
      data: {
        title: data.title && data.title,
        values: data.values && {
          deleteMany: existsAttribute.values.map((value) => ({
            id: value.id,
          })),
          createMany: {
            data: data.values.map((value) => ({ value })),
          },
        },
      },
      include: { values: true },
    });

    return updatedAttribute;
  }

  async delete(id: string): Promise<void> {
    await this.findById(id);
    await this.prismaService.attribute.delete({ where: { id } });
  }
}
