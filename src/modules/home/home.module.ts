import { Module } from "@nestjs/common";
import { HomeController } from "./home.controller";
import { HomeService } from "./home.service";
import { RepositoryModule } from "src/repositories/repository.module";

@Module({
	imports: [RepositoryModule],
	controllers: [HomeController],
	providers: [HomeService],
})
export class HomeModule {}