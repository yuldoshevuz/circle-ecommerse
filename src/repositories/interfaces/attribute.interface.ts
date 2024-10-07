import { Prisma } from '@prisma/client';
import { CreateAttributeDto } from 'src/modules/attribute/dto/create-attribute.dto';
import { UpdateAttributeDto } from 'src/modules/attribute/dto/update-attribute.dto';

export interface CreateAttribute extends CreateAttributeDto {}

export interface UpdateAttribute extends UpdateAttributeDto {}

export type IAttribute = Prisma.AttributeGetPayload<{
  include: {
    values: true;
  };
}>;
