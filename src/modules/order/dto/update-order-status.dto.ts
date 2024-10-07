import { ApiProperty } from "@nestjs/swagger";
import { OrderStatus } from "@prisma/client";
import { IsEnum, IsNotEmpty } from "class-validator";

export class UpdateOrderStatusDto {
	@ApiProperty({ example: OrderStatus['DELIVERING'] })
	@IsEnum(OrderStatus)
	@IsNotEmpty()
	status: OrderStatus;
}