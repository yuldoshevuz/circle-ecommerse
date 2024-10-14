import { Injectable, NotFoundException } from '@nestjs/common';
import { NavbarModelType, Prisma } from '@prisma/client';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import {
  CreateProduct,
  IProduct,
  UpdateProduct,
} from './interfaces/product.interface';
import { BrandRepository } from './brand.repository';
import { CategoryRepository } from './category.repository';
import { TagRepository } from './tag.repository';
import { AttributeRepository } from './attribute.repository';

@Injectable()
export class ProductRepository {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly brandRepository: BrandRepository,
    private readonly categoryRepository: CategoryRepository,
    private readonly tagRepository: TagRepository,
    private readonly attributeRepository: AttributeRepository,
  ) {}

  async count(where?: Prisma.ProductWhereInput): Promise<number> {
    return await this.prismaService.product.count({ where });
  }

  async findAll(
    where?: Prisma.ProductWhereInput,
    errorMessage?: string,
    pageSize: number = 10,
    pageNumber: number = 0,
    orderBy?: Prisma.ProductOrderByWithAggregationInput,
  ): Promise<IProduct[]> {
    const products = await this.prismaService.product.findMany({
      where,
      take: pageSize,
      skip: pageNumber * pageSize,
      orderBy,
      include: {
        images: true,
        brand: true,
        tags: true,
        stocks: {
          include: {
            configurations: {
              include: { attribute: true, value: true },
            },
          },
        },
        attributes: {
          include: { values: true },
        },
        categories: true,
        parameters: true,
      },
    });

    if (!products.length)
      throw new NotFoundException(errorMessage || 'Products not available');

    return products;
  }

  async search(str: string): Promise<IProduct[]> {
    const products = await this.prismaService.product.findMany({
      where: {
        OR: [
          {
            title: { contains: str, mode: 'insensitive' },
          },
          {
            slug: { contains: str, mode: 'insensitive' },
          },
        ],
      },
      take: 5,
      orderBy: { created_at: 'desc' },
      include: {
        images: true,
        brand: true,
        tags: true,
        stocks: {
          include: {
            configurations: {
              include: { attribute: true, value: true },
            },
          },
        },
        attributes: {
          include: { values: true },
        },
        categories: true,
        parameters: true,
      },
    });

    if (!products.length) throw new NotFoundException('Products not available');

    return products;
  }

  async findOne(
    where?: Prisma.ProductWhereInput,
    errorMessage?: string,
  ): Promise<IProduct> {
    const product = await this.prismaService.product.findFirst({
      where,
      include: {
        images: true,
        brand: true,
        tags: true,
        stocks: {
          include: {
            configurations: {
              include: { attribute: true, value: true },
            },
          },
        },
        attributes: {
          include: { values: true },
        },
        categories: true,
        parameters: true,
      },
    });

    if (!product)
      throw new NotFoundException(errorMessage || 'Product not found');

    return product;
  }

  async findById(id: string, errorMessage?: string): Promise<IProduct> {
    return await this.findOne(
      { id },
      errorMessage || 'Product not found with this id. ID: ' + id,
    );
  }

  async findBySlug(slug: string, errorMessage?: string): Promise<IProduct> {
    return await this.findOne(
      { slug },
      errorMessage || 'Product not available with this slug. SLUG: ' + slug,
    );
  }

  async create(data: CreateProduct): Promise<IProduct> {
    const {
      title,
      description,
      brand_id,
      attributes,
      parameters,
      stocks,
      categories,
      tags,
    } = data;

    return this.prismaService.$transaction(async (prisma) => {
      await this.brandRepository.findById(brand_id);

      for (const attributeId of attributes) {
        await this.attributeRepository.findById(attributeId);
      }

      for (const categoryId of categories) {
        await this.categoryRepository.findById(categoryId);
      }

      for (const tagId of tags) {
        await this.tagRepository.findById(tagId);
      }

      for (const stock of stocks) {
        for (const attribute of stock.attributes) {
          await this.attributeRepository.findById(attribute.id);

          const existsAttributeValue = await prisma.attributeValue.findFirst({
            where: {
              id: attribute.value,
              attribute_id: attribute.id,
            },
          });

          if (!existsAttributeValue)
            throw new NotFoundException(
              'Attribute value not found with this id. ID: ' + attribute.value,
            );
        }
      }

      const newProduct = await prisma.product.create({
        data: {
          title,
          description,
          slug: this.categoryRepository.slugger(title),
          brand: { connect: { id: brand_id } },
          attributes: {
            connect: attributes.map((attrId) => ({ id: attrId })),
          },
          categories: {
            connect: categories.map((categoryId) => ({ id: categoryId })),
          },
          tags: {
            connect: tags.map((tagId) => ({ id: tagId })),
          },
          parameters: {
            createMany: {
              data: parameters.map((parameter) => ({
                title: parameter.title,
                value: parameter.value,
              })),
            },
          },
          stocks: {
            create: stocks.map((stock) => ({
              quantity: stock.quantity,
              price: stock.price,
              configurations: {
                create: stock.attributes.map((attr) => ({
                  attribute_id: attr.id,
                  value_id: attr.value,
                })),
              },
            })),
          },
        },
        include: {
          images: true,
          brand: true,
          tags: true,
          stocks: {
            include: {
              configurations: {
                include: { attribute: true, value: true },
              },
            },
          },
          attributes: {
            include: { values: true },
          },
          categories: true,
          parameters: true,
        },
      });

      return newProduct;
    });
  }

  async update(productId: string, data: UpdateProduct): Promise<IProduct> {
    const existingProduct = await this.findById(productId);

    const {
      title,
      description,
      brand_id,
      attributes,
      categories,
      tags,
      parameters,
      stocks,
    } = data;

    // Transactional update
    return this.prismaService.$transaction(async (prisma) => {
      if (brand_id) {
        await this.brandRepository.findById(brand_id);
      }

      if (attributes?.length) {
        for (const attributeId of attributes) {
          await this.attributeRepository.findById(attributeId);
        }
      }

      if (categories?.length) {
        for (const categoryId of categories) {
          await this.categoryRepository.findById(categoryId);
        }
      }

      if (tags?.length) {
        for (const tagId of tags) {
          await this.tagRepository.findById(tagId);
        }
      }

      if (stocks?.length) {
        for (const stock of stocks) {
          for (const attribute of stock.attributes) {
            await this.attributeRepository.findById(attribute.id);

            const existsAttributeValue = await prisma.attributeValue.findFirst({
              where: {
                id: attribute.value,
                attribute_id: attribute.id,
              },
            });

            if (!existsAttributeValue)
              throw new NotFoundException(
                'Attribute value not found with this id. ID: ' +
                  attribute.value,
              );
          }
        }
      }

      const updatedProduct = await prisma.product.update({
        where: { id: productId },
        data: {
          title: title || existingProduct.title,
          description: description || existingProduct.description,
          slug: title
            ? this.categoryRepository.slugger(title)
            : existingProduct.slug,
          brand_id: brand_id && brand_id,
          attributes: attributes && {
            disconnect: existingProduct.attributes.map((attr) => ({
              id: attr.id,
            })),
            connect: attributes.map((attrId) => ({
              id: attrId,
            })),
          },
          categories: categories && {
            disconnect: existingProduct.categories.map((category) => ({
              id: category.id,
            })),
            connect: categories.map((category_id) => ({
              id: category_id,
            })),
          },
          tags: tags && {
            disconnect: existingProduct.tags.map((tag) => ({
              id: tag.id,
            })),
            connect: tags.map((tagId) => ({ id: tagId })),
          },
          parameters: parameters && {
            deleteMany: existingProduct.parameters.map((parameter) => ({
              id: parameter.id,
            })),
            createMany: {
              data: parameters.map((parameter) => ({
                title: parameter.title,
                value: parameter.value,
              })),
            },
          },
          stocks: stocks && {
            deleteMany: existingProduct.stocks.map((stock) => ({
              id: stock.id,
            })),
            create: stocks.map((stock) => ({
              quantity: stock.quantity,
              price: stock.price,
              configurations: {
                create: stock.attributes.map((attr) => ({
                  attribute_id: attr.id,
                  value_id: attr.value,
                })),
              },
            })),
          },
        },
        include: {
          images: true,
          brand: true,
          tags: true,
          stocks: {
            include: {
              configurations: {
                include: { attribute: true, value: true },
              },
            },
          },
          attributes: {
            include: { values: true },
          },
          categories: true,
          parameters: true,
        },
      });

      return updatedProduct;
    });
  }

  async toggleFavourite(productId: string, userId: string): Promise<IProduct> {
		await this.findById(productId);
	
		const existsFavourite = await this.prismaService.user.findFirst({
			where: {
				id: userId,
				favourites: {
					some: { id: productId },
				},
			},
		});
	
		if (existsFavourite) {
			await this.prismaService.user.update({
				where: { id: userId },
				data: {
					favourites: {
						disconnect: { id: productId },
					},
				},
			});
		} else {
			await this.prismaService.user.update({
				where: { id: userId },
				data: {
					favourites: {
						connect: { id: productId },
					},
				},
			});
		}
	
		return await this.findById(productId);
	}	

  async delete(id: string): Promise<void> {
    await this.findById(id);
    await this.prismaService.product.delete({ where: { id } });
  }
}
