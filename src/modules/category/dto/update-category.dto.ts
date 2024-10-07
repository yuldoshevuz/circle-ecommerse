import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, IsUUID } from "class-validator";
import { v4 } from "uuid";

export class UpdateCategoryDto {
	@ApiProperty({ example: 'Computers and laptops', required: false })
	@IsString()
	@IsOptional()
	title?: string;

	@ApiProperty({ example: 'The best computers and laptops', required: false })
	@IsString()
	@IsOptional()
	description?: string;

	@ApiProperty({ example: v4(), required: false })
	@IsString()
	@IsOptional()
	parentId?: string;

	@ApiProperty({
    type: 'array',
    items: { type: 'file', format: 'binary' },
    required: false,
  })
	images?: Express.Multer.File[];
}