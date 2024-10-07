import { Module } from "@nestjs/common";
import { CategoryRepository } from "./category.repository";
import { MediaRepository } from "./media.repository";
import { PrismaModule } from "src/modules/prisma/prisma.module";
import { NavbarRepository } from "./navbar.repository";
import { ProductRepository } from "./product.repository";
import { PromoRepository } from "./promo.repository";
import { TagRepository } from "./tag.repository";
import { BrandRepository } from "./brand.repository";
import { AttributeRepository } from "./attribute.repository";
import { CartRepository } from "./cart.repository";
import { UserRepository } from "./user.repository";
import { OrderRepository } from "./order.repository";

const repositories = [
	NavbarRepository,
	CategoryRepository,
	MediaRepository,
	ProductRepository,
	PromoRepository,
	TagRepository,
	BrandRepository,
	AttributeRepository,
	CartRepository,
	UserRepository,
	OrderRepository,
];

@Module({
	imports: [ PrismaModule ],
	providers: [ ...repositories ],
	exports: [ ...repositories ],
})
export class RepositoryModule {}