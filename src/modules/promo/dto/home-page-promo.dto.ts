class PromoProductDto {
  id: string;
  title: string;
  slug: string;
  price: string;
  thumbnail: string;
  brand: {
    id: string;
    title: string;
    slug: string;
  };
}

export class PromoHomeDto<T> {
	id: string;
	title: string;
	body: string;
	image: string;
	type: T;
	product: PromoProductDto | null;
}

export class HomePagePromoDto {
  left: PromoHomeDto<'main_left'>;
  right: PromoHomeDto<'main_right'>;
}
