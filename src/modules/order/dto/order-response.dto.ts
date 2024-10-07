import { OrderStatus } from "@prisma/client";

export class OrderResponseDto {
	id: string;
	items: {
		id: string;
		quantity: number;
		product: {
			id: string;
			title: string;
			slug: string;
			price: string;
			thumbnail: string;
		}
	}[];
	user_id: string;
	status: OrderStatus;
	total_price: string;
}