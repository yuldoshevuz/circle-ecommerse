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
              include: { attribute: true, values: true },
            },
          },
        },
        // attributes: {
        // 	include: { values: true },
        // },
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
              include: { attribute: true, values: true },
            },
          },
        },
        categories: true,
        parameters: true,
      }
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
              include: { attribute: true, values: true },
            },
          },
        },
        // attributes: {
        // 	include: { values: true },
        // },
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
      // attributes_id,
      categories_id,
      tags_id,
      parameters,
      stocks,
    } = data;

    return this.prismaService.$transaction(async (prisma) => {
      await this.brandRepository.findById(brand_id);

      // for (const attribute_id of attributes_id) {
      //   await this.attributeRepository.findById(attribute_id);
      // }

      for (const category_id of categories_id) {
        await this.categoryRepository.findById(category_id);
      }

      for (const tag_id of tags_id) {
        await this.tagRepository.findById(tag_id);
      }

      for (const stock of stocks) {
        for (const attribute of stock.attributes) {
          const existsAttribute = await this.attributeRepository.findById(
            attribute.id,
          );
          for (const valueId of attribute.values) {
            const existsAttributeValue = await prisma.attributeValue.findFirst({
              where: {
                id: valueId,
                attribute_id: existsAttribute.id,
              },
            });

            if (!existsAttributeValue)
              throw new NotFoundException(
                'Attribute value not found with this id. ID: ' + valueId,
              );
          }
        }
      }

      const newProduct = await prisma.product.create({
        data: {
          title,
          description,
          slug: this.categoryRepository.slugger(title),
          brand: { connect: { id: brand_id } },
          // attributes: {
          //   connect: attributes_id.map((attribute_id) => ({
          //     id: attribute_id,
          //   })),
          // },
          categories: {
            connect: categories_id.map((category_id) => ({ id: category_id })),
          },
          tags: {
            connect: tags_id.map((tag_id) => ({ id: tag_id })),
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
                create: stock.attributes.map((attribute) => ({
                  attribute_id: attribute.id,
                  values: {
                    connect: attribute.values.map((value_id) => ({
                      id: value_id,
                    })),
                  },
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
                include: { attribute: true, values: true },
              },
            },
          },
          // attributes: {
          // 	include: { values: true },
          // },
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
      // attributes_id,
      categories_id,
      tags_id,
      parameters,
      stocks,
    } = data;

    // Transactional update
    return this.prismaService.$transaction(async (prisma) => {
      if (brand_id) {
        await this.brandRepository.findById(brand_id);
      }

      // if (attributes_id?.length) {
      //   for (const attribute_id of attributes_id) {
      // 		await this.attributeRepository.findById(attribute_id);
      //   }
      // }

      if (categories_id?.length) {
        for (const category_id of categories_id) {
          await this.categoryRepository.findById(category_id);
        }
      }

      if (tags_id?.length) {
        for (const tag_id of tags_id) {
          await this.tagRepository.findById(tag_id);
        }
      }

      if (stocks?.length) {
        for (const stock of stocks) {
          for (const attribute of stock.attributes) {
            const existsAttribute = await this.attributeRepository.findById(
              attribute.id,
            );
            for (const valueId of attribute.values) {
              const existsAttributeValue =
                await prisma.attributeValue.findFirst({
                  where: {
                    id: valueId,
                    attribute_id: existsAttribute.id,
                  },
                });

              if (!existsAttributeValue)
                throw new NotFoundException(
                  'Attribute value not found with this id. ID: ' + valueId,
                );
            }
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
          brand: brand_id && { connect: { id: brand_id } },
          // attributes: attributes_id && {
          //   disconnect: existingProduct.attributes.map((attribute) => ({
          //     id: attribute.id,
          //   })),
          //   connect: attributes_id.map((attribute_id) => ({
          //     id: attribute_id,
          //   })),
          // },
          categories: categories_id && {
            disconnect: existingProduct.categories.map((category) => ({
              id: category.id,
            })),
            connect: categories_id.map((category_id) => ({
              id: category_id,
            })),
          },
          tags: tags_id && {
            disconnect: existingProduct.tags.map((tag) => ({
              id: tag.id,
            })),
            connect: tags_id.map((tag_id) => ({ id: tag_id })),
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
                create: stock.attributes.map((attribute) => ({
                  attribute_id: attribute.id,
                  values: {
                    connect: attribute.values.map((value_id) => ({
                      id: value_id,
                    })),
                  },
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
                include: { attribute: true, values: true },
              },
            },
          },
          // attributes: {
          // 	include: { values: true },
          // },
          categories: true,
          parameters: true,
        },
      });

      return updatedProduct;
    });
  }

  async delete(id: string): Promise<void> {
    await this.findById(id);
    await this.prismaService.product.delete({ where: { id } });
  }

  private include(): Prisma.ProductInclude {
    return {
      images: true,
      stocks: {
        include: { configurations: true },
      },
      brand: true,
      tags: true,
      // attributes: {
      //   include: { values: true },
      // },
      parameters: true,
    };
  }
}
