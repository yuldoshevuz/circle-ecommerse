import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateBrandDto {
	@ApiProperty({ example: 'Apple' })
	@IsString()
	@IsNotEmpty()
	title: string;

	@ApiProperty({ example: 'Apple brand description' })
	@IsString()
	@IsNotEmpty()
	description: string;
}