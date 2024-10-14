import { ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { CreateParameterDto, CreateProductDto, CreateStockDto } from "./create-product.dto";
import { ArrayMinSize, IsArray, IsNumberString, IsOptional, IsString, IsUUID, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { v4 } from "uuid";

export class UpdateProductDto extends PartialType(CreateProductDto) {
	@ApiPropertyOptional({ example: 'Galaxy S24 Ultra' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ example: 'Latest model smartphone with advanced features.' })
  @IsString()
  @IsOptional()
  description?: string;

	@ApiPropertyOptional({ example: '800' })
	@IsNumberString() // Use IsString for price
  @IsOptional()
	price?: string;

  @ApiPropertyOptional({ example: v4() })
  @IsUUID('all', { each: true })
  @IsString()
  @IsOptional()
  brand_id?: string;

  @ApiPropertyOptional({
    type: CreateParameterDto,
    isArray: true,
    example: [
      { title: 'Model', value: 'Samsung' },
			{ title: 'Display', value: 'Dynamic LTPO AMOLED 2X, 120Hz' },
      { title: 'Memory', value: '256GB 12GB RAM, 512GB 12GB RAM, 1TB 12GB RAM' },
    ],
  })
  @Type(() => CreateParameterDto)
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @IsArray()
  @IsOptional()
  parameters?: CreateParameterDto[];

  @ApiPropertyOptional({
    type: 'string',
    isArray: true,
    example: [v4(), v4()],
  })
  @ArrayMinSize(1)
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  attributes?: string[];

  @ApiPropertyOptional({
    type: CreateStockDto,
    isArray: true,
    example: [
      {
        attributes: [
					{
						id: v4(),
						value: v4(),
					},
					{
						id: v4(),
						value: v4(),
					}
				],
        quantity: 50,
        price: '499.99',
      },
      {
        attributes: [
					{
						id: v4(),
						value: v4()
					},
					{
						id: v4(),
						value: v4(),
					}
				],
        quantity: 65,
        price: '455',
      },
    ],
  })
  @Type(() => CreateStockDto)
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @IsArray()
  @IsOptional()
  stocks?: CreateStockDto[];


  @ApiPropertyOptional({ example: [v4(), v4()] })
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  @IsOptional()
  @IsUUID('all', { each: true })
  categories: string[];

  @ApiPropertyOptional({
    type: 'array',
    items: { type: 'string' },
    example: [v4(), v4()],
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  @IsOptional()
  @IsUUID('all', { each: true })
  tags: string[];
}