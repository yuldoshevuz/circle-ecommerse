import { Injectable } from '@nestjs/common';
import { ITag } from 'src/repositories/interfaces/tag.interface';
import { TagRepository } from 'src/repositories/tag.repository';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Injectable()
export class TagService {
  constructor(private readonly tagRepository: TagRepository) {}

  async findAll(): Promise<ITag[]> {
    return await this.tagRepository.findAll();
  }

  async findBySlug(slug: string): Promise<ITag> {
    const tag = await this.tagRepository.findOne(
      { slug },
      'Tag not found with this slug',
    );
    return tag;
  }

  async create(data: CreateTagDto): Promise<ITag> {
    const newTag = await this.tagRepository.create(data);
    return newTag;
  }

  async update(id: string, data: UpdateTagDto): Promise<ITag> {
    const updatedTag = await this.tagRepository.update(id, data);
    return updatedTag;
  }

	async delete(id: string): Promise<void> {
		await this.tagRepository.delete(id);
	}
}
