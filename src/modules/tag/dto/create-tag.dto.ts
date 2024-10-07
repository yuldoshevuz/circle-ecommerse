import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateTagDto {
	@ApiProperty({ example: 'New' })
	@IsString()
	@IsNotEmpty()
	title: string;

	@ApiProperty({ example: 'New products' })
	@IsString()
	@IsNotEmpty()
	description: string;
}