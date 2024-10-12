import { CategoryResponseDto } from "src/modules/category/dto/category-response.dto";
import { ProductOneResponseDto } from "src/modules/product/dto/product-response.dto";
import { PromoHomeDto } from "src/modules/promo/dto/home-page-promo.dto";

export class HomeResponseDto {
	promos: PromoHomeDto<string>[];
	categories: CategoryResponseDto[];
	new_products: ProductOneResponseDto[];
}