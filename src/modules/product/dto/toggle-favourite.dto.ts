import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUUID } from "class-validator";
import { v4 } from "uuid";

export class ToggleProductFavouriteDto {
	@ApiProperty({ example: v4() })
	@IsUUID('all')
	@IsString()
	@IsNotEmpty()
	product_id: string;
}