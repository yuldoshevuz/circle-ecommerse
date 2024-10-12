import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { CreateUser, UpdateUser } from './interfaces/user.interface';

@Injectable()
export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findOne(
    where?: Prisma.UserWhereInput,
    errorMessage?: string,
  ): Promise<User> {
    const existsUser = await this.prismaService.user.findFirst({
      where,
    });

    if (!existsUser)
      throw new NotFoundException(errorMessage || 'User not found');

    return existsUser;
  }

  async findById(id: string, errorMessage?: string): Promise<User> {
    return await this.findOne({ id }, errorMessage || 'User not found with this id');
  }

  async findByEmail(email: string): Promise<User> {
    return await this.prismaService.user.findFirst({
			where: { email },
		});
  }

  async create(data: CreateUser): Promise<User> {
    const existsUser = await this.prismaService.user.findFirst({
      where: { email: data.email },
    });

    if (existsUser)
      throw new BadRequestException('User already exists with this email');

    const newUser = await this.prismaService.user.create({ data });
    return newUser;
  }

  async update(id: string, data: UpdateUser): Promise<User> {
    await this.findById(id);

    if (data.email) {
      const existsUser = await this.findByEmail(data.email);
			
      if (existsUser)
        throw new BadRequestException('User already exists with this email');
    }

    const updatedUser = await this.prismaService.user.update({
      where: { id },
      data,
    });

		return updatedUser;
  }
}
