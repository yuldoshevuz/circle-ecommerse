import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class ProductsQueryDto {
	@ApiPropertyOptional({ description: 'Number of elements on page' })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  pageSize: number;

  @ApiPropertyOptional({ description: 'Page sequence number' })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  pageNumber: number;

	@ApiPropertyOptional({ description: 'Filter by categories id' })
	@IsString()
	@IsOptional()
	category: string;

	@ApiPropertyOptional({ description: 'Filter by tags id' })
	@IsString()
	@IsOptional()
	tags: string;

	@ApiPropertyOptional({ description: 'Filter by brands id' })
	@IsString()
	@IsOptional()
	brand: string;
}