import { Prisma } from '@prisma/client';
import { CreateTagDto } from 'src/modules/tag/dto/create-tag.dto';
import { UpdateTagDto } from 'src/modules/tag/dto/update-tag.dto';

export type ITag = Prisma.TagGetPayload<{
  include: { products: true };
}>;

export interface CreateTag extends CreateTagDto {}

export interface UpdateTag extends UpdateTagDto {}
