import { Injectable } from '@nestjs/common';
import { IProduct } from 'src/repositories/interfaces/product.interface';
import { ProductRepository } from 'src/repositories/product.repository';
import { UpdateProductDto } from './dto/update-product-dto';
import { CreateProductDto } from './dto/create-product.dto';
import {
  ProductManyResponseDto,
  ProductOneResponseDto,
} from './dto/product-response.dto';
import { NavbarModelType, Prisma } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { ProductsQueryDto } from './dto/product.dto';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly configService: ConfigService,
  ) {}

  async findAll(
    { pageNumber, pageSize, category, tags, brand }: ProductsQueryDto,
    request: Request,
  ): Promise<ProductManyResponseDto> {
    const productWhere: Prisma.ProductWhereInput = {
      categories: {
        some: { id: category },
      },
      tags: {
        some: { id: tags },
      },
      brand: {
        id: brand,
      },
    };

    const products = await this.productRepository.findAll(
      productWhere,
      'Products not available now',
      pageSize,
      pageNumber,
    );

    const baseUrl = this.configService.get<string>('BASE_URL');
    const totalCount = await this.productRepository.count(productWhere);
    const url = baseUrl + request.path;

    return this.formatResponseAll(
      products,
      url,
      pageSize,
      pageNumber,
      totalCount,
    );
  }

  async search(str: string): Promise<ProductOneResponseDto[]> {
    const products = await this.productRepository.search(str);
    return products.map((product) => this.formatResponseOne(product));
  }

  async findBySlug(slug: string): Promise<ProductOneResponseDto> {
    const product = await this.productRepository.findBySlug(slug);
    return this.formatResponseOne(product);
  }

  async create(dto: CreateProductDto): Promise<ProductOneResponseDto> {
    const newProduct = await this.productRepository.create(dto);
    return this.formatResponseOne(newProduct);
  }

  async update(
    id: string,
    dto: UpdateProductDto,
  ): Promise<ProductOneResponseDto> {
    const updated = await this.productRepository.update(id, dto);
    return this.formatResponseOne(updated);
  }

  async delete(id: string): Promise<void> {
    await this.productRepository.delete(id);
  }

  private formatResponseOne(product: IProduct): ProductOneResponseDto {
    return {
      id: product.id,
      title: product.title,
      slug: product.slug,
      description: product.description,
      thumbnail: product.images?.length
        ? process.env.BASE_URL + product.images[0]?.path
        : null,
      price: product.stocks[0].price,
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
      // attributes: product.attributes.map(attr => ({
      // 	id: attr.id,
      // 	title: attr.title,
      // 	data: attr.values.map(val => ({ id: val.id, value: val.value })),
      // })),
      images: product.images.map((image) => ({
        id: image.id,
        path: process.env.BASE_URL + image.path,
      })),
      stocks: product.stocks.map((stock) => ({
        id: stock.id,
        configurations: stock.configurations.map((config) => ({
          id: config.id,
          title: config.attribute?.title,
          values:
            config.values?.map((val) => ({
              id: val.id,
              value: val.value,
            })) || [],
        })),
        quantity: stock.quantity,
        price: stock.price,
      })),
      parameters: product.parameters.map((param) => ({
        id: param.id,
        title: param.title,
        value: param.value,
      })),
    };
  }

  private formatResponseAll(
    products: IProduct[],
    url: string,
    pageSize: number = 10,
    pageNumber: number = 0,
    totalCount: number,
  ): ProductManyResponseDto {
    const currentPage = pageNumber;
    const totalPages = Math.ceil(totalCount / pageSize);
    const totalItems = totalCount;

    const navigationLinks = [];

    for (let page = 0; page < totalPages; page++) {
      navigationLinks.push({
        url: `${url}?page=${page}`,
        label: `${page}`,
        isActive: page === currentPage,
      });
    }

    navigationLinks.unshift({
      url: currentPage > 0 ? `${url}?page=${currentPage - 1}` : null,
      label: `Previous`,
      isActive: false,
    });

    navigationLinks.push({
      url:
        currentPage !== totalPages - 1
          ? `${url}?page=${currentPage + 1}`
          : null,
      label: 'Next',
      active: false,
    });

    return {
      data: products.map((product) => ({
        id: product.id,
        title: product.title,
        slug: product.slug,
        thumbnail: product.images?.length
          ? {
              id: product.images[0].id,
              path: process.env.BASE_URL + product.images[0].path,
            }
          : null,
        price: product.stocks[0].price,
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
      })),
      paginationLinks: {
        first: `${url}?page=0`,
        last: `${url}?page=${totalPages - 1}`,
        prev: currentPage > 0 ? `${url}?page=${currentPage - 1}` : null,
        next:
          currentPage !== totalPages - 1
            ? `${url}?page=${currentPage + 1}`
            : null,
      },
      meta: {
        currentPage,
        startItem: products[0].id,
        totalPages,
        navigationLinks,
        endItem: products[products.length - 1].id,
        path: url,
        itemsPerPage: pageSize,
        totalItems,
      },
    };
  }
}
