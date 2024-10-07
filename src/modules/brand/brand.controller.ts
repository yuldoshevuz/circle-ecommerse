import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put
} from '@nestjs/common';
import { BrandService } from './brand.service';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateBrandDto } from './dto/create-brand.dto';
import { AuthDecorator } from '../auth/decorators/auth.decorator';
import { RoleUser } from '@prisma/client';

@Controller('brand')
@ApiTags('Brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Get()
  async findAll() {
    return this.brandService.findAll();
  }

  @Get(':slug')
  async findBySlug(@Param('slug') slug: string) {
    return this.brandService.findBySlug(slug);
  }

  @Post()
	@AuthDecorator(RoleUser['ADMIN'])
	@ApiBearerAuth('accessToken')
  async create(@Body() data: CreateBrandDto) {
    return this.brandService.create(data);
  }

  @Put(':id')
	@AuthDecorator(RoleUser['ADMIN'])
	@ApiBearerAuth('accessToken')
  async update(@Param('id') id: string, @Body() data: UpdateBrandDto) {
    return this.brandService.update(id, data);
  }

  @Delete(':id')
	@AuthDecorator(RoleUser['ADMIN'])
	@ApiBearerAuth('accessToken')
  async delete(@Param('id') id: string) {
    return this.brandService.delete(id);
  }
}
