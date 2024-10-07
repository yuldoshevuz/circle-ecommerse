import { ApiProperty } from "@nestjs/swagger";
import { NavbarModelType } from "@prisma/client";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";

export class CreateNavbarItemDto {
	@ApiProperty({ example: 'New' })
	@IsString()
	@IsNotEmpty()
	text: string;
	
	@ApiProperty({ example: 'tags' })
	@IsEnum(NavbarModelType)
	@IsNotEmpty()
	model_type: NavbarModelType;

	@ApiProperty({ example: 'new' })
	@IsString()
	@IsNotEmpty()
	slug: string;

	@ApiProperty({ type: 'string', format: 'binary', required: false })
	image?: Express.Multer.File;
}