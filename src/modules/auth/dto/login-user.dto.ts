import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class LoginUserDto {
	@ApiProperty({ example: 'mukhammadaliweb@gmail.com' })
	@IsEmail()
	@IsString()
	@IsNotEmpty()
	email: string;

	@ApiProperty({ example: 'qwerty12345' })
	@MinLength(5)
	@IsString()
	@IsNotEmpty()
	password: string;
}