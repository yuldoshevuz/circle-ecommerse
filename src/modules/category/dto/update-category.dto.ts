import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { v4 } from 'uuid';

export class UpdateCategoryDto {
  @ApiPropertyOptional({ example: 'Computers and laptops' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ example: 'The best computers and laptops' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: v4() })
  @IsString()
  @IsOptional()
  parentId?: string;

  @ApiPropertyOptional({
    type: 'array',
    items: { type: 'file', format: 'binary' },
  })
  images?: Express.Multer.File[];

  @ApiPropertyOptional({ example: true })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value === 'true' ? true : false;
    }
    return value;
  })
  @IsBoolean()
  @IsOptional()
  is_featured?: boolean;
}
