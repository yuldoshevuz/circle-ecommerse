import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { RequestWithUser } from "src/common/interfaces/request-with-user.interface";
import { UserRepository } from "src/repositories/user.repository";
import * as jwt from "jsonwebtoken";
import { UserJwtPaylod } from "../interfaces/user-jwt-payload.interface";

@Injectable()
export class JwtAuthGuard implements CanActivate {
	private readonly JWT_SECRET: string;

	constructor(
		private readonly configService: ConfigService,
		private readonly userRepository: UserRepository,
	) {
		this.JWT_SECRET = configService.get<string>('JWT_SECRET');
	}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest<RequestWithUser>();
		const authHeader = request.headers['authorization'];

		if (!authHeader || !authHeader.startsWith('Bearer ')) {
			throw new UnauthorizedException();
		}

		const accessToken = authHeader.split(' ')[1];

		try {
			const decoded = <UserJwtPaylod>jwt.verify(accessToken, this.JWT_SECRET);
			
			if (!decoded.user_id) throw new UnauthorizedException();

			const existsUser = await this.userRepository.findById(decoded.user_id, 'User not found');

			request.user = existsUser;
			return true;
		} catch (error) {
			throw new UnauthorizedException('Token is invalid');
		}
	}
}