import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateAttributeDto {
  @ApiProperty({ example: 'Disk' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: ['32GB', '64GB', '128GB', '256GB', '512GB', '1TB'],
  })
  @IsString({ each: true })
	@IsArray()
  @IsNotEmpty()
  values: string[];
}
