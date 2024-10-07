import { Body, Controller, Get, ParseFilePipe, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { PromoService } from "./promo.service";
import { ApiBearerAuth, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { FileInterceptor } from "@nestjs/platform-express";
import { FileUploadService } from "src/common/services/file-upload.service";
import { CreatePromoDto } from "./dto/create-promo.dto";
import { AuthDecorator } from "../auth/decorators/auth.decorator";
import { RoleUser } from "@prisma/client";

@Controller('promo')
@ApiTags('Promo')
export class PromoController {
	constructor(private readonly promoService: PromoService) {}

	@Get()
	async findAll() {
		return this.promoService.findAll();
	}

	@Get('home-page')
	async findHome() {
		return this.promoService.homePagePromo();
	}

	@Post()
	@AuthDecorator(RoleUser['ADMIN'])
	@ApiBearerAuth('accessToken')
	@ApiConsumes('multipart/form-data')
	@UseInterceptors(
		FileInterceptor('image', new FileUploadService().uploadFileOptions())
	)
	async createPromo(
		@Body() dto: CreatePromoDto,
		@UploadedFile(new ParseFilePipe({ fileIsRequired: false }))
		image: Express.Multer.File
	) {
		return this.promoService.createPromo({ ...dto, image });
	}
}