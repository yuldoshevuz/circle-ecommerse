import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { MediaService } from 'src/common/services/media.service';
import { RepositoryModule } from 'src/repositories/repository.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [RepositoryModule, ConfigModule],
  controllers: [CategoryController],
  providers: [CategoryService, MediaService],
})
export class CategoryModule {}
