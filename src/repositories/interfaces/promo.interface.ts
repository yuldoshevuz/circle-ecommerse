import { Prisma } from "@prisma/client";

export type IPromo = Prisma.PromoGetPayload<{
	include: {
		product: { include: { brand: true, stocks: true } }
	}
}>

export interface CreatePromo {
	title: string;
	body: string;
	image?: string;
	type: string;
	product_id: string;
}