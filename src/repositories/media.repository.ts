import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { isUUID } from 'class-validator';
import { CreateMedia, IMedia } from './interfaces/media.interface';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { Media, Prisma } from '@prisma/client';
import { ProductRepository } from './product.repository';
import { CategoryRepository } from './category.repository';

@Injectable()
export class MediaRepository {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly productRepository: ProductRepository,
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async findAll(where?: Prisma.MediaWhereInput): Promise<IMedia[]> {
    if (where?.id && !isUUID(where.id, 'all'))
      throw new BadRequestException('Invalid ID');

    const media = await this.prismaService.media.findMany({
      where,
    });
    if (!media.length) throw new NotFoundException('Media no available');

    return media.map(image => this.formatResponse(image));
  }

  async findOne(where: Prisma.MediaWhereInput): Promise<IMedia> {
    if (where?.id && !isUUID(where.id, 'all'))
      throw new BadRequestException('Invalid ID');

    const media = await this.prismaService.media.findFirst({
      where,
		});
    if (!media) throw new NotFoundException('Media not found');

    return this.formatResponse(media);
  }

  async findById(id: string): Promise<IMedia> {
    return await this.findOne({ id });
  }

  async create(data: CreateMedia): Promise<IMedia> {
    const { model_type, model_id, path } = data;

    let newMedia: Media;

    if (model_type === 'categories') {
      await this.categoryRepository.findById(model_id);
      newMedia = await this.prismaService.media.create({
        data: { model_type, path, category_id: model_id },
      });
    } else if (model_type === 'products') {
      await this.productRepository.findById(model_id);
      newMedia = await this.prismaService.media.create({
        data: { model_type, path, product_id: model_id },
      });
    }

    return this.formatResponse(newMedia);
  }

  async bulkCreate(...data: CreateMedia[]): Promise<IMedia[]> {
    const media: IMedia[] = [];

    if (data.length) {
      for (const chunk of data) {
        const newMedia = await this.create(chunk);
        media.push(newMedia);
      }
    }

    return media;
  }

  async delete(id: string): Promise<void> {
    await this.findById(id);
    await this.prismaService.media.delete({
      where: { id },
    });
  }

	private formatResponse(media: Media): IMedia {
		return {
			id: media.id,
			path: process.env.BASE_URL + '/images/' + media.path,
		}
	}
}
