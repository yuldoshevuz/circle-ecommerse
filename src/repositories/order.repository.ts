import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import {
  CreateOrder,
  IOrder,
  UpdateOrderStatus,
} from './interfaces/order.interface';
import { UserRepository } from './user.repository';
import { CartRepository } from './cart.repository';

@Injectable()
export class OrderRepository {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userRepository: UserRepository,
    private readonly cartRepository: CartRepository,
  ) {}

  async findAll(where?: Prisma.OrderWhereInput): Promise<IOrder[]> {
    const orders = await this.prismaService.order.findMany({
      where,
      orderBy: { created_at: 'desc' },
      include: {
        items: {
          include: {
            stock: {
              include: {
                configurations: {
									include: { attribute: true, value: true }
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

    if (!orders.length) throw new NotFoundException('Orders not available now');

    return orders;
  }

  async findOne(
    where?: Prisma.OrderWhereInput,
    errorMessage?: string,
  ): Promise<IOrder> {
    const existsOrder = await this.prismaService.order.findFirst({
      where,
      include: {
        items: {
          include: {
            stock: {
              include: {
                configurations: {
									include: { attribute: true, value: true }
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

    if (!existsOrder)
      throw new NotFoundException(errorMessage || 'Order not found');

    return existsOrder;
  }

  async create(data: CreateOrder): Promise<IOrder> {
    return this.prismaService.$transaction(async (prisma) => {
      const { user_id, status } = data;

      await this.userRepository.findById(user_id);

      const existsCart = await this.cartRepository.findByUserId(user_id);

      if (!existsCart.items || existsCart.items.length === 0) {
        throw new NotFoundException('Cart is empty or not found for this user');
      }

      let totalPrice = existsCart.items.reduce((total, item) => {
        return total + Number(item.stock.price) * item.quantity;
      }, 0);

      const newOrder = await prisma.order.create({
        data: {
          status,
          user_id,
          items: {
            createMany: {
              data: existsCart.items.map((cartItem) => ({
                stock_id: cartItem.stock_id,
                quantity: cartItem.quantity,
              })),
            },
          },
          total_price: String(totalPrice),
        },
        include: {
          items: {
            include: {
              stock: {
                include: {
                  configurations: {
										include: { attribute: true, value: true }
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

			await this.cartRepository.clear(existsCart.id);

      return newOrder;
    });
  }

  async updateStatus(
    id: string,
    { status }: UpdateOrderStatus,
  ): Promise<IOrder> {
    return this.prismaService.$transaction(async (prisma) => {
      const existsOrder = await this.findOne({ id });

      if (
        existsOrder.status === 'CANCELED' ||
        existsOrder.status === 'COMPLETED'
      ) {
        throw new BadRequestException(
          'You cannot change the order status. Order already delivered or canceled',
        );
      }

      const updatedOrder = await prisma.order.update({
        where: { id },
        data: { status },
        include: {
          items: {
            include: {
              stock: {
                include: {
                  configurations: {
										include: { attribute: true, value: true }
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

      return updatedOrder;
    });
  }
}
