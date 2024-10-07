import { Module } from "@nestjs/common";
import { RepositoryModule } from "src/repositories/repository.module";
import { BrandController } from "./brand.controller";
import { BrandService } from "./brand.service";
import { ConfigModule } from "@nestjs/config";

@Module({
	imports: [RepositoryModule, ConfigModule],
	controllers: [BrandController],
	providers: [BrandService]
})
export class BrandModule {}