import { Body, Controller, Post, Req } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterUserDto } from "./dto/register-user.dto";
import { LoginUserDto } from "./dto/login-user.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { RequestWithUser } from "src/common/interfaces/request-with-user.interface";
import { AuthDecorator } from "./decorators/auth.decorator";
import { RoleUser } from "@prisma/client";

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('register')
	async register(@Body() dto: RegisterUserDto) {
		return this.authService.register(dto);
	}

	@Post('login')
	async login(@Body() dto: LoginUserDto) {
		return this.authService.login(dto);
	}
}