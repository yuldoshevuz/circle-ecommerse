export class CartResponseDto {
  id: string;
  quantity: number;
  product: {
    id: string;
    title: string;
    slug: string;
    price: string;
    available_quantity: number;
    thumbnail: string | null;
  };
}[];
