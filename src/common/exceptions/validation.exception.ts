import { HttpException, HttpStatus, ValidationError } from "@nestjs/common"

export class ValidationException extends HttpException {
	constructor(public validationErrors?: ValidationError[], message?: string) {
		super({
			statusCode: HttpStatus.BAD_REQUEST,
			message: `Validation failed!${ message && ' ' + message || ''}`,
			errors: validationErrors
		}, HttpStatus.BAD_REQUEST);
	}
}