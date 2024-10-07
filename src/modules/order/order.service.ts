import { Injectable } from '@nestjs/common';
import { RequestWithUser } from 'src/common/interfaces/request-with-user.interface';
import { OrderRepository } from 'src/repositories/order.repository';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus } from '@prisma/client';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { IOrder } from 'src/repositories/interfaces/order.interface';
import { OrderResponseDto } from './dto/order-response.dto';

@Injectable()
export class OrderService {
  constructor(private readonly orderRepository: OrderRepository) {}

  async findAll(): Promise<OrderResponseDto[]> {
    const orders = await this.orderRepository.findAll();
    return orders.map((order) => this.formatResponse(order));
  }

  async findMy(request: RequestWithUser): Promise<OrderResponseDto[]> {
    const user_id = request.user.id;
    const orders = await this.orderRepository.findAll({ user_id });

    return orders.map((order) => this.formatResponse(order));
  }

  async findMyById(
    id: string,
    request: RequestWithUser,
  ): Promise<OrderResponseDto> {
    const user_id = request.user.id;
    const order = await this.orderRepository.findOne({ id, user_id });

    return this.formatResponse(order);
  }

  async findById(id: string): Promise<OrderResponseDto> {
    const order = await this.orderRepository.findOne({ id });
    return this.formatResponse(order);
  }

  async create(
    dto: CreateOrderDto,
    request: RequestWithUser,
  ): Promise<OrderResponseDto> {
    const user_id = request.user.id;
    const newOrder = await this.orderRepository.create({
      ...dto,
      user_id,
      status: OrderStatus['PENDING'],
    });

    return this.formatResponse(newOrder);
  }

  async updateStatus(
    id: string,
    dto: UpdateOrderStatusDto,
  ): Promise<OrderResponseDto> {
    const updatedOrder = await this.orderRepository.updateStatus(id, dto);
    return this.formatResponse(updatedOrder);
  }

  private formatResponse(order: IOrder): OrderResponseDto {
    return {
      id: order.id,
      user_id: order.user_id,
      status: order.status,
      items: order.items.map((item) => ({
        id: item.id,
        product: {
          id: item.stock.product.id,
          title: item.stock.product.title,
          slug: item.stock.product.title,
          thumbnail: item.stock.product.images?.length
            ? process.env.BASE_URL + item.stock.product.images[0].path
            : null,
          price: item.stock.price,
        },
        quantity: item.quantity,
      })),
      total_price: order.total_price,
    };
  }
}
