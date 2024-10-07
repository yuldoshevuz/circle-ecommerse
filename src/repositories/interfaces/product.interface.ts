import { Prisma } from '@prisma/client';
import { CreateProductDto } from 'src/modules/product/dto/create-product.dto';
import { UpdateProductDto } from 'src/modules/product/dto/update-product-dto';

export type IProduct = Prisma.ProductGetPayload<{
  include: {
    images: true;
    brand: true;
    tags: true;
    stocks: {
			include: {
				configurations: {
					include: { attribute: true, values: true }
				}
			}
		};
		// attributes: {
		// 	include: { values: true };
		// };
		categories: true;
		parameters: true;
  };
}>;

export interface CreateProduct extends CreateProductDto {};

export interface UpdateProduct extends UpdateProductDto {};