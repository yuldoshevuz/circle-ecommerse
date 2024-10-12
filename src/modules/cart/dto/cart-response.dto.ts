export class CartResponseDto {
  id: string;
  product: {
		id: string;
    title: string;
    slug: string;
		price: string;
    available_quantity: number;
    thumbnail: string | null;
  };
	configurations: {
		id: string;
		title: string;
		value: string;
	}[];
	quantity: number;
}[];
