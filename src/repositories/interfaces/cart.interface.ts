import { Prisma } from '@prisma/client';
import { CreateCartItemDto } from 'src/modules/cart/dto/create-cart-item.dto';
import { UpdateCartItemDto } from 'src/modules/cart/dto/update-cart-item.dto';

export type ICart = Prisma.CartGetPayload<{
  include: {
    items: {
      include: {
        stock: {
          include: {
            configurations: true;
            product: {
							include: { images: true }
						};
          };
        };
      };
    };
  };
}>;

export interface CreateCartItem extends CreateCartItemDto {
	user_id: string
};

export interface UpdateCartItem extends UpdateCartItemDto {};
