import { Module } from "@nestjs/common";
import { TagController } from "./tag.controller";
import { TagService } from "./tag.service";
import { RepositoryModule } from "src/repositories/repository.module";
import { ConfigModule } from "@nestjs/config";

@Module({
	imports: [RepositoryModule, ConfigModule],
	controllers: [TagController],
	providers: [TagService]
})
export class TagModule {}