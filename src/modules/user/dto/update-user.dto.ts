import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString } from "class-validator";

export class UpdateUserDto {
	@ApiPropertyOptional({ example: 'Muhammadali Yuldoshev' })
	@IsString()
	@IsOptional()
	full_name?: string;

	@ApiPropertyOptional({ example: 'mukhammadaliweb@gmail.com' })
	@IsEmail()
	@IsString()
	@IsOptional()
	email?: string;
}