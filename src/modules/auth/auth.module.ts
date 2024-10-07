import { Module } from "@nestjs/common";
import { RepositoryModule } from "src/repositories/repository.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { jwtConfig } from "src/config/jwt.config";
import { JwtAuthGuard } from "./guards/auth.guard";

@Module({
	imports: [
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: jwtConfig,
		}),
		ConfigModule,
		RepositoryModule,
	],
	controllers: [AuthController],
	providers: [AuthService, JwtAuthGuard],
	exports: [JwtAuthGuard],
})
export class AuthModule {}