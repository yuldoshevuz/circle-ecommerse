import { Module } from '@nestjs/common';
import { NavbarModule } from './modules/navbar/navbar.module';
import { CategoryModule } from './modules/category/category.module';
import { ProductModule } from './modules/product/product.module';
import { PromoModule } from './modules/promo/promo.module';
import { TagModule } from './modules/tag/tag.module';
import { BrandModule } from './modules/brand/brand.module';
import { AttributeModule } from './modules/attribute/attribute.module';
import { CartModule } from './modules/cart/cart.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { OrderModule } from './modules/order/order.module';
import { HomeModule } from './modules/home/home.module';

@Module({
  imports: [
		NavbarModule,
		CategoryModule,
		ProductModule,
		PromoModule,
		TagModule,
		BrandModule,
		ProductModule,
		AttributeModule,
		CartModule,
		UserModule,
		AuthModule,
		UserModule,
		OrderModule,
		HomeModule,
	]
})
export class AppModule {}
