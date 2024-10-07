import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseFilePipe,
  Post,
  Put,
  Query,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { ProductsQueryDto } from './dto/product.dto';
import { UpdateProductDto } from './dto/update-product-dto';
import { CreateProductDto } from './dto/create-product.dto';
import { MediaService } from 'src/common/services/media.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from 'src/common/services/file-upload.service';
import { CreateProductImageDto } from './dto/create-product-image.dto';
import { CreateMedia } from 'src/repositories/interfaces/media.interface';
import { NavbarModelType, RoleUser } from '@prisma/client';
import { CheckExistsModel } from 'src/common/guards/check-exists-model.guard';
import { Request } from 'express';
import { AuthDecorator } from '../auth/decorators/auth.decorator';
import { RequestWithUser } from 'src/common/interfaces/request-with-user.interface';

@Controller('product')
@ApiTags('Product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly mediaService: MediaService,
  ) {}

  @Get()
  async findAll(@Query() query: ProductsQueryDto, @Req() request: Request) {
    return this.productService.findAll(query, request);
  }

	@Get('search')
  async search(@Query('title') title: string) {
    return this.productService.search(title);
  }

  @Get(':slug')
  async findBySlug(@Param('slug') slug: string) {
    return this.productService.findBySlug(slug);
  }

  @Post()
  @AuthDecorator(RoleUser['ADMIN'])
  @ApiBearerAuth('accessToken')
  async create(@Body() dto: CreateProductDto) {
    return this.productService.create({ ...dto });
  }

  @Put(':id')
  @AuthDecorator(RoleUser['ADMIN'])
  @ApiBearerAuth('accessToken')
  async update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productService.update(id, { ...dto });
  }

  @Post(':id/image')
  @AuthDecorator(RoleUser['ADMIN'])
  @ApiBearerAuth('accessToken')
  @UseGuards(CheckExistsModel)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FilesInterceptor('images', 10, new FileUploadService().uploadFileOptions()),
  )
  async createMedia(
    @Param('id') id: string,
    @UploadedFiles(new ParseFilePipe({ fileIsRequired: true }))
    images: Express.Multer.File[],
    @Body() imageBodyDto: CreateProductImageDto,
  ) {
    const mediaData: CreateMedia[] = images.map((image) => ({
      model_id: id,
      model_type: NavbarModelType['products'],
      path: image.filename,
    }));

    return this.mediaService.bulkCreate(...mediaData);
  }

  @Delete(':id')
  @AuthDecorator(RoleUser['ADMIN'])
  @ApiBearerAuth('accessToken')
  async delete(@Param('id') id: string) {
    return this.productService.delete(id);
  }

  @Delete(':id/image')
  @AuthDecorator(RoleUser['ADMIN'])
  @ApiBearerAuth('accessToken')
  async deleteMedia(@Param('id') id: string) {
    return this.mediaService.removeMedia(id);
  }
}
