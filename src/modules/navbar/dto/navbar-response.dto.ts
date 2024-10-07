import { NavbarModelType } from "@prisma/client";

export class NavbarResponseDto {
	slug: string;
	type: NavbarModelType;
	title: string;
	image: string | null;
}

export class HeaderResponseDto {
	header: NavbarResponseDto[];
}

export class FooterResponseDto {
	footer: NavbarResponseDto[];
}