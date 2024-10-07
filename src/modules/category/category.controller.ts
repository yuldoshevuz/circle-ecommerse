import { Body, Controller, Delete, Get, Param, ParseFilePipe, Post, Put, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from 'src/common/services/file-upload.service';
import { MediaService } from 'src/common/services/media.service';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AuthDecorator } from '../auth/decorators/auth.decorator';
import { RoleUser } from '@prisma/client';

@Controller('category')
@ApiTags('Category')
export class CategoryController {
  constructor(
		private readonly categoryService: CategoryService,
		private readonly mediaService: MediaService
	) {}

  @Get()
  async findAll() {
    return this.categoryService.findAll();
  }

  @Get(':slug')
  async findBySlug(@Param('slug') slug: string) {
    return this.categoryService.findBySlug(slug);
  }

  @Post()
	@AuthDecorator(RoleUser['ADMIN'])
	@ApiBearerAuth('accessToken')
	@ApiConsumes('multipart/form-data')
	@UseInterceptors(
		FilesInterceptor('images', 10, new FileUploadService().uploadFileOptions())
	)
  async create(
		@Body() dto: CreateCategoryDto,
		@UploadedFiles(new ParseFilePipe({ fileIsRequired: false }))
		images: Express.Multer.File[]
	) {
    return this.categoryService.create({ ...dto, images });
  }

	@Put(':id')
	@AuthDecorator(RoleUser['ADMIN'])
	@ApiBearerAuth('accessToken')
	@ApiConsumes('multipart/form-data')
	@UseInterceptors(
		FilesInterceptor('images', 10, new FileUploadService().uploadFileOptions())
	)
	async update(
		@Param('id') id: string,
		@UploadedFiles(new ParseFilePipe({ fileIsRequired: false }))
		images: Express.Multer.File[],
		@Body() dto: UpdateCategoryDto

	) {
		return this.categoryService.update(id, { ...dto, images })
	}

	@Delete(':id')
	@AuthDecorator(RoleUser['ADMIN'])
	@ApiBearerAuth('accessToken')
	async delete(@Param('id') id: string) {
		return this.categoryService.delete(id);
	} 

	@Delete('image/:id')
	@AuthDecorator(RoleUser['ADMIN'])
	@ApiBearerAuth('accessToken')
	async removeMedia(@Param('id') id: string) {
		return this.mediaService.removeMedia(id);
	}
}
