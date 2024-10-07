import { NavbarModelType } from "@prisma/client";

export interface CreateMedia {
	model_type: NavbarModelType;
	path: string;
	model_id: string;
}

export interface IMedia {
	id: string;
	path: string;
}