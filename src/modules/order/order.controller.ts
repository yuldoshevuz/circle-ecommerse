import { Body, Controller, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { RequestWithUser } from 'src/common/interfaces/request-with-user.interface';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/auth.guard';
import { OnlyAdminGuard } from '../auth/guards/role-admin.guard';
import { RoleUser } from '@prisma/client';
import { AuthDecorator } from '../auth/decorators/auth.decorator';

@Controller('order')
@ApiTags('Order')
@ApiBearerAuth('accessToken')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @AuthDecorator(RoleUser['ADMIN'])
  @Get()
  async findAll() {
    return this.orderService.findAll();
  }

  @AuthDecorator(RoleUser['USER'])
	@Get('my')
  async findMy(@Req() request: RequestWithUser) {
		return this.orderService.findMy(request);
  }
	
  @AuthDecorator(RoleUser['USER'])
  @Get('my/:id')
  async findMyById(@Param('id') id: string, @Req() request: RequestWithUser) {
		return this.orderService.findMyById(id, request);
  }
	
  @AuthDecorator(RoleUser['USER'])
  @Post('my')
  async create(@Req() request: RequestWithUser, @Body() dto: CreateOrderDto) {
    return this.orderService.create(dto, request);
  }

  @AuthDecorator(RoleUser['USER'])
  @Put(':id')
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.orderService.updateStatus(id, dto);
  }

	@AuthDecorator(RoleUser['ADMIN'])
  @Get(':id')
  async findById(@Param('id') id: string) {
		console.log('Req');
    return this.orderService.findById(id);
  }
}
