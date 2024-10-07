import { ApiProperty } from "@nestjs/swagger";

export class CreateProductImageDto {
	@ApiProperty({
    type: 'array',
    items: { type: 'file', format: 'binary' },
    required: true,
  })
	images?: Express.Multer.File[];
}