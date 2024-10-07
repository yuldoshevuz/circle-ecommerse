import { Injectable } from "@nestjs/common";
import * as fs from 'fs/promises'
import { existsSync } from "fs";
import { MediaRepository } from "src/repositories/media.repository";
import { CreateMedia, IMedia } from "src/repositories/interfaces/media.interface";

@Injectable()
export class MediaService {
	constructor(
		private readonly mediaRepository: MediaRepository
	) {}

	async create(dto: CreateMedia): Promise<IMedia> {
		return await this.mediaRepository.create(dto);
	}

	async bulkCreate(...dto: CreateMedia[]): Promise<IMedia[]> {
		return await this.mediaRepository.bulkCreate(...dto);
	}

	async findAll(): Promise<IMedia[]> {
		return await this.mediaRepository.findAll();
	}

	async findOne(id: string): Promise<IMedia> {
		return await this.mediaRepository.findById(id)
	}

	async removeMedia(id: string): Promise<void> {
			const media = await this.mediaRepository.findById(id);
	
			if (existsSync(media.path)) {
				await fs.unlink(media.path);
			}
	
			await this.mediaRepository.delete(id);
	}
}