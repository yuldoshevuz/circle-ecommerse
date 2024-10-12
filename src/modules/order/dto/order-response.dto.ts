import { OrderStatus } from "@prisma/client";

export class OrderResponseDto {
	id: string;
	items: {
		id: string;
		product: {
			id: string;
			title: string;
			slug: string;
			price: string;
			thumbnail: string;
		}
		configurations: {
			id: string;
			title: string;
			value: string;
		}[];
		quantity: number;
	}[];
	user_id: string;
	status: OrderStatus;
	total_price: string;
}