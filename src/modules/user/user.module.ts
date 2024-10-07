import { Module } from "@nestjs/common";
import { RepositoryModule } from "src/repositories/repository.module";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { ConfigModule } from "@nestjs/config";

@Module({
	imports: [RepositoryModule, ConfigModule],
	controllers: [UserController],
	providers: [UserService],
})
export class UserModule {}