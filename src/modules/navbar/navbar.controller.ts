import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { NavbarService } from './navbar.service';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { CreateNavbarItemDto } from './dto/create-navbar-item.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from 'src/common/services/file-upload.service';
import { NavbarType, RoleUser } from '@prisma/client';
import { AuthDecorator } from '../auth/decorators/auth.decorator';

@Controller('navbar')
@ApiTags('Navbar')
export class NavbarController {
  constructor(private readonly navbarService: NavbarService) {}

  @Get('header')
  async getHeader() {
    return this.navbarService.getHeader();
  }

  @Post('header')
	@AuthDecorator(RoleUser['ADMIN'])
	@ApiBearerAuth('accessToken')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('image', new FileUploadService().uploadFileOptions()),
  )
  async addHeaderItem(
    @Body() dto: CreateNavbarItemDto,
    @UploadedFile(new ParseFilePipe({ fileIsRequired: false }))
    image: Express.Multer.File,
  ) {
    return this.navbarService.createNavbarItem(
      { ...dto, image },
      NavbarType['header'],
    );
  }

  @Get('footer')
  async getFooter() {
    return this.navbarService.getFooter();
  }

  @Post('footer')
	@AuthDecorator(RoleUser['ADMIN'])
	@ApiBearerAuth('accessToken')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('image', new FileUploadService().uploadFileOptions()),
  )
  async addFooterItem(
    @Body() dto: CreateNavbarItemDto,
    @UploadedFile(new ParseFilePipe({ fileIsRequired: false }))
    image: Express.Multer.File,
  ) {
    return this.navbarService.createNavbarItem(
      { ...dto, image },
      NavbarType['footer'],
    );
  }

  @Delete(':slug')
	@AuthDecorator(RoleUser['ADMIN'])
	@ApiBearerAuth('accessToken')
  async removeNavbarItem(@Param('slug') slug: string) {
    return this.navbarService.removeNavbarItem(slug);
  }
}
