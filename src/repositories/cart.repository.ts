import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CartItem, Prisma } from '@prisma/client';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import {
  CreateCartItem,
  ICart,
  UpdateCartItem,
} from './interfaces/cart.interface';
import { ValidationException } from 'src/common/exceptions/validation.exception';
import { UserRepository } from './user.repository';

@Injectable()
export class CartRepository {
  constructor(
		private readonly prismaService: PrismaService,
		private readonly userRepository: UserRepository,
	) {}

  async findOne(
    where?: Prisma.CartWhereInput,
    errorMessage?: string,
  ): Promise<ICart> {
    const cart = await this.prismaService.cart.findFirst({
      where,
      include: {
        items: {
          include: {
            stock: {
              include: {
                configurations: {
									include: { attribute: true, value: true },
								},
                product: {
                  include: { images: true },
                },
              },
            },
          },
        },
      },
    });

    if (!cart) throw new NotFoundException(errorMessage || 'Cart not found');

    return cart;
  }

  async findItem(
    where?: Prisma.CartItemWhereInput,
    errorMessage?: string,
  ): Promise<CartItem> {
    const cartItem = await this.prismaService.cartItem.findFirst({
      where,
    });		

    if (!cartItem)
      throw new NotFoundException(errorMessage || 'Cart item not found');

    return cartItem;
  }

  async findById(id: string, errorMessage?: string): Promise<ICart> {
    return await this.findOne(
      { id },
      errorMessage || 'Cart not found with this id. ID: ' + id,
    );
  }

  async findByUserId(user_id: string): Promise<ICart> {
   	await this.userRepository.findById(user_id);

    const existsCart = await this.prismaService.cart.findFirst({
      where: { user_id },
    });

    if (!existsCart) {
      await this.prismaService.cart.create({
        data: { user_id },
      });
    }

    return await this.findOne({ user_id });
  }

  async createItem(data: CreateCartItem): Promise<ICart> {
    return this.prismaService.$transaction(async (prisma) => {
      const { user_id, stock_id, quantity } = data;

      const existsUser = await prisma.user.findFirst({
        where: { id: user_id },
      });

      if (!existsUser)
        throw new NotFoundException(
          'User not found with this id. ID: ' + user_id,
        );

      const cart = await this.findByUserId(user_id);

      const existsStock = await prisma.stock.findFirst({
        where: { id: stock_id },
      });
      if (!existsStock)
        throw new NotFoundException(
          'Stock not found with this id. ID: ' + stock_id,
        );

				
				if (quantity === 0)
					throw new ValidationException([], 'Quantity must be greater than 0');
				
			const existsCartItem = await prisma.cartItem.findFirst({
				where: {
					stock_id,
					cart: { user_id }
				}
			});

			if (existsCartItem) {
				return await this.updateItem(existsCartItem.id, { quantity });
			}

      const updatedCart = await prisma.cart.update({
        where: { id: cart.id },
        data: {
          user_id,
          items: {
            create: { stock_id, quantity },
          },
        },
        include: {
          items: {
            include: {
              stock: {
                include: {
                  configurations: {
										include: { attribute: true, value: true },
									},
                  product: true,
                },
              },
            },
          },
        },
      });

      await prisma.stock.update({
        where: { id: stock_id },
        data: {
          quantity: { decrement: quantity },
        },
      });

      return updatedCart;
    });
  }

  async updateItem(id: string, { quantity }: UpdateCartItem): Promise<ICart> {
    return this.prismaService.$transaction(async (prisma) => {
      const cartItem = await this.findItem(
        { id },
        'Cart not found with this id',
      );

      if (quantity === 0) {
        await this.deleteItem({ id });
      }

      if (!quantity) {
        return await this.findById(cartItem.cart_id);
      }

      let count: number = 0;
      let increment: boolean;

      if (quantity > cartItem.quantity) {
        count = quantity - cartItem.quantity;
        increment = false;
      }

      if (quantity < cartItem.quantity) {
        count = cartItem.quantity - quantity;
        increment = true;
      }

      await prisma.cartItem.update({
        where: { id },
        data: { quantity },
      });

      await prisma.stock.update({
        where: { id: cartItem.stock_id },
        data: {
          quantity: increment ? { increment: count } : { decrement: count },
        },
      });

      const cart = await this.findById(cartItem.cart_id);
      return cart;
    });
  }

  async deleteItem(where?: Prisma.CartItemWhereInput, errorMessage?: string) {
    return this.prismaService.$transaction(async (prisma) => {
      const cartItem = await this.findItem(where, errorMessage || 'Cart item not found');

      await prisma.cartItem.delete({ where: { id: cartItem.id } });
      await prisma.stock.update({
        where: { id: cartItem.stock_id },
        data: {
          quantity: { increment: cartItem.quantity },
        },
      });
    });
  }

	async clear(id: string): Promise<void> {
		await this.findById(id);
		await this.prismaService.cartItem.deleteMany({
			where: { cart_id: id },
		});
	}

  private include(): Prisma.CartInclude {
    return {
      items: {
        include: {
          stock: {
            include: {
              configurations: true,
              product: true,
            },
          },
        },
      },
    };
  }
}
