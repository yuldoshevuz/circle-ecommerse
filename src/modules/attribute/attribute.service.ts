import { Injectable } from '@nestjs/common';
import { AttributeRepository } from 'src/repositories/attribute.repository';
import { IAttribute } from 'src/repositories/interfaces/attribute.interface';
import { AttributeResponseDto } from './dto/attribute-response.dto';
import { CreateAttributeDto } from './dto/create-attribute.dto';
import { UpdateAttributeDto } from './dto/update-attribute.dto';

@Injectable()
export class AttributeService {
  constructor(private readonly attributeRepository: AttributeRepository) {}

  async findAll(): Promise<AttributeResponseDto[]> {
    const attributes = await this.attributeRepository.findAll();
		return attributes.map(attribute => this.formatResponse(attribute));
  }

	async findById(id: string): Promise<AttributeResponseDto> {
		const attribute = await this.attributeRepository.findById(id);
		return this.formatResponse(attribute);
	}

	async create(dto: CreateAttributeDto): Promise<AttributeResponseDto> {
		const newAttribute = await this.attributeRepository.create(dto);
		return this.formatResponse(newAttribute);
	}

	async update(id: string, dto: UpdateAttributeDto): Promise<AttributeResponseDto> {
		const updated = await this.attributeRepository.update(id, dto);
		return this.formatResponse(updated);
	}

	async delete(id: string): Promise<void> {
		await this.attributeRepository.delete(id);
	}

  private formatResponse(attribute: IAttribute): AttributeResponseDto {
    return {
      id: attribute.id,
      title: attribute.title,
      values: attribute.values.map((value) => ({
        id: value.id,
        value: value.value,
      })),
    };
  }
}
