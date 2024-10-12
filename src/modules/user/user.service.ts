import { Injectable } from '@nestjs/common';
import { RequestWithUser } from 'src/common/interfaces/request-with-user.interface';
import { IUser } from 'src/repositories/interfaces/user.interface';
import { UserRepository } from 'src/repositories/user.repository';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async profile(request: RequestWithUser): Promise<IUser> {
    const userId = request.user.id;

    const user = await this.userRepository.findById(userId);
    return this.formatResponse(user);
  }

  async update(request: RequestWithUser, dto: UpdateUserDto): Promise<IUser> {
    const userId = request.user.id;

		const updatedUser = await this.userRepository.update(userId, dto);
		return this.formatResponse(updatedUser);
  }

  private formatResponse(user: User): IUser {
    return {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      role: user.role,
    };
  }
}
