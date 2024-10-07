import { Module } from "@nestjs/common";
import { ProductController } from "./product.controller";
import { ProductService } from "./product.service";
import { RepositoryModule } from "src/repositories/repository.module";
import { MediaService } from "src/common/services/media.service";
import { ConfigModule } from "@nestjs/config";

@Module({
	imports: [RepositoryModule, ConfigModule],
	controllers: [ProductController],
	providers: [ProductService, MediaService]
})
export class ProductModule {}