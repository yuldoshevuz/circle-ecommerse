import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class UpdateTagDto {
	@ApiProperty({ example: 'New', required: false })
	@IsString()
	@IsOptional()
	title?: string;

	@ApiProperty({ example: 'New tag description', required: false })
	@IsString()
	@IsOptional()
	description?: string;
}