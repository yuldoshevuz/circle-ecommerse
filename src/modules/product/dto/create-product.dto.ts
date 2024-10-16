import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
  IsUUID,
  IsNumberString,
} from 'class-validator';
import { v4 } from 'uuid';

export class CreateParameterDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  value: string;
}

export class AddAttributeDto {
  @IsString()
  @IsNotEmpty()
	id: string;

  @IsString()
  @IsNotEmpty()
	value: string;
}

export class CreateStockDto {
	@Type(() => AddAttributeDto)
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @IsArray()
  @IsNotEmpty()
  attributes: AddAttributeDto[];

  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsNumberString() // Use IsString for price
  @IsNotEmpty()
  price: string;
}

export class CreateProductDto {
  @ApiProperty({ example: 'Galaxy S24 Ultra' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Latest model smartphone with advanced features.' })
  @IsString()
  @IsNotEmpty()
  description: string;

	@ApiProperty({ example: '800' })
	@IsNumberString() // Use IsString for price
  @IsNotEmpty()
	price: string;

  @ApiProperty({ example: v4() })
  @IsUUID('all', { each: true })
  @IsString()
  @IsNotEmpty()
  brand_id: string;

  @ApiProperty({
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
  @IsNotEmpty()
  parameters: CreateParameterDto[];

  @ApiProperty({
    type: 'string',
    isArray: true,
    example: [v4(), v4()],
  })
  @ArrayMinSize(1)
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  attributes: string[];

  @ApiProperty({
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
  @IsNotEmpty()
  stocks: CreateStockDto[];

  @ApiProperty({ example: [v4(), v4()] })
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  @IsNotEmpty()
  @IsUUID('all', { each: true })
  categories: string[];

  @ApiProperty({
    type: 'array',
    items: { type: 'string' },
    example: [v4(), v4()],
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  @IsNotEmpty()
  @IsUUID('all', { each: true })
  tags: string[];
}
