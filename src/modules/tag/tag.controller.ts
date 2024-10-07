import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { TagService } from "./tag.service";
import { CreateTagDto } from "./dto/create-tag.dto";
import { UpdateTagDto } from "./dto/update-tag.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AuthDecorator } from "../auth/decorators/auth.decorator";
import { RoleUser } from "@prisma/client";

@Controller('tag')
@ApiTags('Tags')
export class TagController {
	constructor(private readonly tagService: TagService) {}

	@Get()
	async findAll() {
		return this.tagService.findAll();
	}

	@Get(':slug')
	async findBySlug(@Param('slug') slug: string) {
		return this.tagService.findBySlug(slug);
	}

	@Post()
	@AuthDecorator(RoleUser['ADMIN'])
	@ApiBearerAuth('accessToken')
	async create(@Body() dto: CreateTagDto) {
		return this.tagService.create(dto);
	}

	@Put(':id')
	@AuthDecorator(RoleUser['ADMIN'])
	@ApiBearerAuth('accessToken')
	async update(
		@Param('id') id: string,
		@Body() dto: UpdateTagDto
	) {
		return this.tagService.update(id, dto);
	}

	@Delete(':id')
	@AuthDecorator(RoleUser['ADMIN'])
	@ApiBearerAuth('accessToken')
	async delete(@Param('id') id: string) {
		await this.tagService.delete(id);
	}
}