import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { v4 } from 'uuid';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Smartphones and gadgets' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Smartphones and gadgets are interesting' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: v4(), required: false })
  @IsString()
  @IsOptional()
  parentId: string;

  @ApiProperty({
    type: 'array',
    items: { type: 'file', format: 'binary' },
    required: false,
  })
  images?: Express.Multer.File[];
}
