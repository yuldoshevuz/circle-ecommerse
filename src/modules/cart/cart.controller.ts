import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from "@nestjs/common";
import { CartService } from "./cart.service";
import { RequestWithUser } from "src/common/interfaces/request-with-user.interface";
import { CreateCartItemDto } from "./dto/create-cart-item.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AuthDecorator } from "../auth/decorators/auth.decorator";
import { UpdateCartItemDto } from "./dto/update-cart-item.dto";
import { RoleUser } from "@prisma/client";

@Controller('cart')
@ApiTags('Cart')
@ApiBearerAuth('accessToken')
@AuthDecorator(RoleUser['USER'])
export class CartController {
	constructor(private readonly cartService: CartService) {}

	@Get()
	async find(@Req() request: RequestWithUser) {
		return this.cartService.findByUserId(request);
	}

	@Post()
	async createItem(
		@Req() request: RequestWithUser,
		@Body() dto: CreateCartItemDto,
	) {
		return this.cartService.createItem(request, dto);
	}

	@Put(':id')
	async updateItem(
		@Param('id') id: string,
		@Body() dto: UpdateCartItemDto
	) {
		return this.cartService.updateItem(id, dto);
	}

	@Delete(':id')
	async deleteItem(@Param('id') id: string) {
		return this.cartService.deleteItem(id);
	}
}