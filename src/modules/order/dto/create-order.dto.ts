import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsNotEmpty, IsNumber, IsString, ValidateNested } from "class-validator";
import { v4 } from "uuid";

class CreateOrderItemDto {
	@ApiProperty({ example: v4() })
	@IsString()
	@IsNotEmpty()
	stock_id: string;

	@ApiProperty({ example: 2 })
	@Type(() => Number)
	@IsNumber()
	@IsNotEmpty()
	quantity: number;
}

export class CreateOrderDto {
	// @ApiProperty({ example: v4() })
	// @IsString()
	// @IsNotEmpty()
	// cart_id: string;

	// @ApiProperty({
	// 	example: [
	// 		{ stock_id: v4(), quantity: 2 },
	// 		{ stock_id: v4(), quantity: 1 },
	// 	]
	// })
	// @Type(() => CreateOrderItemDto)
  // @ArrayMinSize(1)
  // @ValidateNested({ each: true })
  // @IsArray()
  // @IsNotEmpty()
	// items: CreateOrderItemDto[];
}