import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { AttributeService } from "./attribute.service";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CreateAttributeDto } from "./dto/create-attribute.dto";
import { UpdateAttributeDto } from "./dto/update-attribute.dto";
import { AuthDecorator } from "../auth/decorators/auth.decorator";
import { RoleUser } from "@prisma/client";

@Controller('attribute')
@ApiTags('Attribute')
export class AttributeController {
	constructor(private readonly attributeService: AttributeService) {}

	@Get()
	async findAll() {
		return this.attributeService.findAll();
	}

	@Get(':id')
	async findById(@Param('id') id: string) {
		return this.attributeService.findById(id);
	}

	@Post()
	@ApiBearerAuth('accessToken')
	@AuthDecorator(RoleUser['ADMIN'])
	async create(@Body() dto: CreateAttributeDto) {
		return this.attributeService.create(dto);
	}

	@Put(':id')
	@ApiBearerAuth('accessToken')
	@AuthDecorator(RoleUser['ADMIN'])
	async update(
		@Param('id') id: string,
		@Body() dto: UpdateAttributeDto
	) {
		return this.attributeService.update(id, dto);
	}

	@Delete(':id')
	@ApiBearerAuth('accessToken')
	@AuthDecorator(RoleUser['ADMIN'])
	async delete(@Param('id') id: string) {
		return this.attributeService.delete(id);
	}
}