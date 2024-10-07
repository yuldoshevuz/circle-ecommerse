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

	@ApiPropertyOptional({ example: 'qwerty12345' })
	@IsString()
	@IsOptional()
	old_password?: string;

	@ApiPropertyOptional({ example: '12345qwerty' })
	@IsString()
	@IsOptional()
	password?: string;
}