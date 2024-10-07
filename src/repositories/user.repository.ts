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
    return await this.findOne({ email }, 'User not found with this email');
  }

  async create(data: CreateUser): Promise<User> {
    const existsUser = await this.prismaService.user.findFirst({
      where: { email: data.email },
    });

    if (existsUser)
      throw new BadRequestException('User already exists with this email');

    const { full_name, email, password } = data;

    const newUser = await this.prismaService.user.create({
      data: { full_name, email, password },
    });

    return newUser;
  }

  async update(id: string, data: UpdateUser): Promise<User> {
    const user = await this.findById(id);

    const { full_name, email, password } = data;

    if (email) {
      const existsUser = await this.prismaService.user.findFirst({
        where: { email },
      });

      if (existsUser)
        throw new BadRequestException('User already exists with this email');
    }

    const updatedUser = await this.prismaService.user.update({
      where: { id },
      data: {
        full_name: full_name || user.full_name,
        email: email || user.email,
        password: password || user.password,
      },
    });

		return updatedUser;
  }
}
