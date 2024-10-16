import { NavbarModelType } from "@prisma/client";
import { IMedia } from "src/repositories/interfaces/media.interface";

export class ProductManyResponseDto {
  data: {
		id: string; // Mahsulotning identifikatori
		title: string; // Mahsulot nomi
		slug: string; // Mahsulotning URL uchun ishlatiladigan qisqartmasi
		price: string; // Mahsulot narxi
		thumbnail: IMedia; // Mahsulotning asosiy tasviri URL
	
		brand: {
			id: string; // Brendning identifikatori
			title: string; // Brend nomi
			slug: string; // Brendning URL qisqartmasi
		};
	
		tags: {
			id: string; // Tegning identifikatori
			title: string; // Teg nomi
			slug: string; // Tegning URL qisqartmasi
			type: NavbarModelType; // Tegning turi (NavbarModelType)
		}[];
	}[];

  paginationLinks: {
    first: string; // Birinchi sahifa uchun URL
    last: string; // Oxirgi sahifa uchun URL
    prev: string; // Oldingi sahifa uchun URL
    next: string; // Keyingi sahifa uchun URL
  };

  meta: {
    currentPage: number; // Joriy sahifa raqami
    startItem: string; // Sahifadagi birinchi elementning identifikatori
    totalPages: number; // Umumiy sahifalar soni
    navigationLinks: {
      url: string; // Sahifa URL manzili
      label: string; // Sahifa belgisi
      isActive: boolean; // Joriy sahifani ko'rsatadimi
    }[];
    path: string; // Asosiy URL manzil yo'li
    itemsPerPage: number; // Har bir sahifada ko'rsatiladigan elementlar soni
    endItem: string; // Sahifadagi oxirgi elementning identifikatori
    totalItems: number; // Umumiy elementlar soni
  };
}

export class ProductOneResponseDto {
	id: string;
	title: string;
	description: string;
	slug: string;
	price: string;
	thumbnail: string;
	brand: {
		id: string;
		title: string;
		slug: string;
	};
	tags: {
		id: string;
		title: string;
		slug: string;
		type: NavbarModelType;
	}[];
	attributes: {
		id: string;
		title: string;
		data: {
			id: string;
			value: string;
		}[];
	}[];
	images: IMedia[];
	stocks: {
		id: string;
		quantity: number;
		price: string;
		configurations: {
			id: string;
			title: string;
			value: string;
		}[];
	}[];
	parameters: {
		id: string;
		title: string;
		value: string;
	}[];
}

export class ProductsSearchResponseDto {
	products: ProductOneResponseDto[];
	suggestions: string[];
};