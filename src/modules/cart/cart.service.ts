import { Injectable } from '@nestjs/common';
import { RequestWithUser } from 'src/common/interfaces/request-with-user.interface';
import { CartRepository } from 'src/repositories/cart.repository';
import { ICart } from 'src/repositories/interfaces/cart.interface';
import { CartResponseDto } from './dto/cart-response.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { CreateCartItemDto } from './dto/create-cart-item.dto';

@Injectable()
export class CartService {
  constructor(private readonly cartRepository: CartRepository) {}

  async findByUserId(request: RequestWithUser): Promise<CartResponseDto[]> {
    const user_id = request['user'].id;
    const cart = await this.cartRepository.findByUserId(user_id);

    return this.formatResponse(cart);
  }

  async createItem(request: RequestWithUser, dto: CreateCartItemDto) {
    const user_id = request['user'].id;
    const newCart = await this.cartRepository.createItem({ ...dto, user_id });

    return this.formatResponse(newCart);
  }

  async updateItem(
    id: string,
    dto: UpdateCartItemDto,
  ): Promise<CartResponseDto[]> {
    const updated = await this.cartRepository.updateItem(id, dto);
    return this.formatResponse(updated);
  }

  async deleteItem(id: string): Promise<void> {
    await this.cartRepository.deleteItem({ id });
  }

  private formatResponse(cart: ICart): CartResponseDto[] {
    return cart.items.map(({ id, stock, quantity }) => ({
      id,
      product: {
        id: stock.product.id,
        title: stock.product.title,
        slug: stock.product.slug,
				price: stock.price,
        available_quantity: stock.quantity,
        thumbnail: stock.product.images?.length
          ? process.env.BASE_URL + '/images/' + stock.product.images[0].path
          : null,
      },
      configurations: stock.configurations.map((config) => ({
        id: config.id,
        title: config.attribute.title,
        value: config.value.value,
      })),
      quantity,
    }));
  }
}
