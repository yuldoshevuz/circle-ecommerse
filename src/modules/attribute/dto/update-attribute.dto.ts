import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateAttributeDto } from './create-attribute.dto';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class UpdateAttributeDto extends PartialType(CreateAttributeDto) {
  @ApiPropertyOptional({ example: 'Disk' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({
    example: ['32GB', '64GB', '128GB'],
  })
  @IsString({ each: true })
	@IsArray()
  @IsOptional()
  values?: string[];
}
