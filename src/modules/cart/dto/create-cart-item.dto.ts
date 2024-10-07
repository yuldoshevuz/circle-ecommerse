import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { v4 } from "uuid";

export class CreateCartItemDto {
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