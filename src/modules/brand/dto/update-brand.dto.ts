import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class UpdateBrandDto {
	@ApiProperty({ example: 'Samsung', required: false })
	@IsString()
	@IsOptional()
	title?: string;

	@ApiProperty({ example: 'Samsung brand description', required: false })
	@IsString()
	@IsOptional()
	description?: string;
}