import { Module } from "@nestjs/common";
import { RepositoryModule } from "src/repositories/repository.module";
import { AttributeController } from "./attribute.controller";
import { AttributeService } from "./attribute.service";
import { ConfigModule } from "@nestjs/config";

@Module({
	imports: [RepositoryModule, ConfigModule],
	controllers: [AttributeController],
	providers: [AttributeService],
})
export class AttributeModule {}