import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class RegisterUserDto {
	@ApiProperty({ example: 'Muhammadali Yuldoshev' })
	@IsString()
	@IsNotEmpty()
	full_name: string;

	@ApiProperty({ example: 'mukhammadaliweb@gmail.com' })
	@IsEmail()
	@IsString()
	@IsNotEmpty()
	email: string;

	@ApiProperty({ example: 'qwerty12345' })
	@IsString()
	@IsNotEmpty()
	password: string;
}