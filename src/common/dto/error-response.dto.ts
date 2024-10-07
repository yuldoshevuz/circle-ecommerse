import { ValidationError } from "class-validator";

export class ErrorResponseDto {
	statusCode: number;
	errors: ValidationError | [];
	message: string;

	constructor(statusCode: number, message: string, errors: ValidationError | null) {
		this.statusCode = statusCode;
		this.message = message;
		this.errors = errors || [];
	}
}