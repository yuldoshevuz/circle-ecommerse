import { OrderStatus, Prisma } from '@prisma/client';
import { CreateOrderDto } from 'src/modules/order/dto/create-order.dto';
import { UpdateOrderStatusDto } from 'src/modules/order/dto/update-order-status.dto';

export type IOrder = Prisma.OrderGetPayload<{
  include: {
    items: {
      include: {
        stock: {
          include: {
            configurations: true;
            product: {
              include: { images: true };
            };
          };
        };
      };
    };
  };
}>;

export interface CreateOrder extends CreateOrderDto {
	user_id: string;
	status: OrderStatus
};

export interface UpdateOrderStatus extends UpdateOrderStatusDto {};
