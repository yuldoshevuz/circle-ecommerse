import { NavbarModelType } from "@prisma/client";
import { IMedia } from "src/repositories/interfaces/media.interface";

class ChildCategoryDto {
	id: string;
	slug: string;
	type: NavbarModelType;
	title: string;
	images: IMedia[] | [];
}

class ProductChildTag {
	id: string;
	title: string;
	slug: string;
	type: NavbarModelType
}

class ChildProductDto {
	id: string;
	title: string;
	price: string;
	images: IMedia[] | [];
	brand: {
		id: string;
		title: string;
		slug: string;
	};
	tags: ProductChildTag[];
}

export class CategoryResponseDto {
	id: string;
	title: string;
	slug: string;
	is_featured: boolean;
	images: IMedia[] | [];
	children: ChildCategoryDto[];
	products: ChildProductDto[];
}