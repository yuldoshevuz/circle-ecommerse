import { Module } from '@nestjs/common';
import { RepositoryModule } from 'src/repositories/repository.module';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [RepositoryModule, ConfigModule],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
