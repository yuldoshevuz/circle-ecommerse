import { Injectable } from '@nestjs/common';
import { PromoService } from '../promo/promo.service';
import { CategoryService } from '../category/category.service';
import { PromoRepository } from 'src/repositories/promo.repository';
import { CategoryRepository } from 'src/repositories/category.repository';
import { TagRepository } from 'src/repositories/tag.repository';
import { ProductRepository } from 'src/repositories/product.repository';
import { HomeResponseDto } from './dto/home-response.dto';
import { NavbarModelType } from '@prisma/client';

@Injectable()
export class HomeService {
  constructor(
    private readonly promoRepository: PromoRepository,
    private readonly categoryRepository: CategoryRepository,
    private readonly productRepository: ProductRepository,
  ) {}

  async getHomePage(): Promise<HomeResponseDto> {
    const promos = await this.promoRepository.findAll({}, 5);

    const categories = await this.categoryRepository.findAll(
      {
        parent_id: null,
        is_featured: true,
      },
      5,
    );

    const newProducts = await this.productRepository.findAll(
      {
        tags: {
          some: {
            title: { startsWith: 'New' },
          },
        },
      },
      undefined,
      4,
    );

    return {
      categories: categories.map((category) => ({
        id: category.id,
        title: category.title,
        slug: category.slug,
        is_featured: category.is_featured,
        images: category.images.map(({ id, path }) => ({
          id,
          path: process.env.BASE_URL + '/images/' + path,
        })),
        children: category.children.map((item) => ({
          id: item.id,
          title: item.title,
          slug: item.slug,
          type: NavbarModelType['categories'],
          images: item.images.map(({ id, path }) => ({
            id,
            path: process.env.BASE_URL + '/images/' + path,
          })),
        })),
        products: category.products.map((product) => ({
          id: product.id,
          title: product.title,
          price: product.price,
          brand: {
            id: product.brand.id,
            title: product.brand.title,
            slug: product.brand.slug,
          },
          images: product.images.map(({ id, path }) => ({
            id,
            path: process.env.BASE_URL + '/images/' + path,
          })),
          tags: product.tags.map(({ id, title, slug }) => ({
            id,
            title,
            slug,
            type: NavbarModelType.tags,
          })),
        })),
      })),
      promos: promos.map((promo) => ({
        id: promo.id,
        title: promo.title,
        body: promo.body,
        type: promo.type,
        image: process.env.BASE_URL + '/images/' + promo.image,
        product:
          (promo.product && {
            id: promo.product.id,
            title: promo.product.title,
            slug: promo.product.slug,
            brand: {
              id: promo.product.brand.id,
              title: promo.product.brand.title,
              slug: promo.product.brand.slug,
            },
            thumbnail: promo.product.images
              ? process.env.BASE_URL + '/images/' + promo.product.images[0].path
              : null,
            price: promo.product.price,
          }) ||
          null,
      })),
      new_products: newProducts.map((product) => ({
        id: product.id,
        title: product.title,
        slug: product.slug,
        description: product.description,
        thumbnail: product.images?.length
          ? process.env.BASE_URL + '/images/' + product.images[0]?.path
          : null,
        price: product.price,
        brand: {
          id: product.brand.id,
          title: product.brand.title,
          slug: product.brand.slug,
        },
        tags: product.tags.map((tag) => ({
          id: tag.id,
          title: tag.title,
          slug: tag.slug,
          type: NavbarModelType['tags'],
        })),
        attributes: product.attributes.map((attr) => ({
          id: attr.id,
          title: attr.title,
          data: attr.values.map((val) => ({ id: val.id, value: val.value })),
        })),
        images: product.images.map((image) => ({
          id: image.id,
          path: process.env.BASE_URL + '/images/' + image.path,
        })),
        stocks: product.stocks.map((stock) => ({
          id: stock.id,
          configurations: stock.configurations.map((config) => ({
            id: config.id,
            title: config.attribute.title,
            value: config.value.value,
          })),
          quantity: stock.quantity,
          price: stock.price,
        })),
        parameters: product.parameters.map((param) => ({
          id: param.id,
          title: param.title,
          value: param.value,
        })),
      })),
    };
  }
}
