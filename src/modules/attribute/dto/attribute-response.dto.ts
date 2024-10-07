export class AttributeResponseDto {
	id: string;
	title: string;
	values: {
		id: string;
		value: string;
	}[];
}