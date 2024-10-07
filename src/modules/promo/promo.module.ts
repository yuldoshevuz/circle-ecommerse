import { Module } from "@nestjs/common";
import { PromoController } from "./promo.controller";
import { PromoService } from "./promo.service";
import { RepositoryModule } from "src/repositories/repository.module";
import { ConfigModule } from "@nestjs/config";

@Module({
	imports: [RepositoryModule, ConfigModule],
	controllers: [PromoController],
	providers: [PromoService]
})
export class PromoModule {}