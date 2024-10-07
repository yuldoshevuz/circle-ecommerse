import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUUID } from "class-validator";
import { v4 } from "uuid";

export class CreatePromoDto {
	@ApiProperty({ example: 'Incredible speed and battery life?', required: true })
	@IsString()
	@IsNotEmpty()
	title: string;

	@ApiProperty({ example: 'main_left', required: true })
	@IsString()
	@IsNotEmpty()
	type: string;

	@ApiProperty({ example: 'from $399', required: true })
	@IsString()
	@IsNotEmpty()
	body: string;

	@ApiProperty({ example: v4(), required: true })
	@IsUUID('all')
	@IsString()
	@IsNotEmpty()
	product_id: string;
	
	@ApiProperty({
    type: 'file',
    required: false,
  })
	image?: Express.Multer.File;
}