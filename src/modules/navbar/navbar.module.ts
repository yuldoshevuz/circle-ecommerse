import { Module } from "@nestjs/common";
import { NavbarController } from "./navbar.controller";
import { NavbarService } from "./navbar.service";
import { RepositoryModule } from "src/repositories/repository.module";
import { ConfigModule } from "@nestjs/config";

@Module({
	imports: [RepositoryModule, ConfigModule],
	controllers: [NavbarController],
	providers: [NavbarService]
})
export class NavbarModule {}