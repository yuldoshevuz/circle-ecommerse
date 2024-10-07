import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsOptional } from "class-validator";

export class UpdateCartItemDto {
	@ApiPropertyOptional({ example: 2 })
	@Type(() => Number)
	@IsNumber()
	@IsOptional()
	quantity?: number;
}