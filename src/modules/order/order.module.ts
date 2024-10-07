import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { RepositoryModule } from "src/repositories/repository.module";
import { OrderController } from "./order.controller";
import { OrderService } from "./order.service";

@Module({
	imports: [RepositoryModule, ConfigModule],
	controllers: [OrderController],
	providers: [OrderService],
})
export class OrderModule {}