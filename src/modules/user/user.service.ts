import { BadRequestException, Injectable } from '@nestjs/common';
import { RequestWithUser } from 'src/common/interfaces/request-with-user.interface';
import { IUser } from 'src/repositories/interfaces/user.interface';
import { UserRepository } from 'src/repositories/user.repository';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '@prisma/client';
import * as bcryptjs from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async profile(request: RequestWithUser): Promise<IUser> {
    const userId = request.user.id;

    const user = await this.userRepository.findById(userId);
    return this.formatResponse(user);
  }

  async update(request: RequestWithUser, dto: UpdateUserDto) {
    const userId = request.user.id;
		const { full_name, email, old_password, password } = dto;

		if (password) {
			if (!old_password) throw new BadRequestException('Old password is required');

			const existsUser = await this.userRepository.findById(userId);

			const isMatchPassword = await bcryptjs.compare(
				old_password,
				existsUser.password,
			);

			if (!isMatchPassword) throw new BadRequestException('Old password is incorrect');

			const salt = await bcryptjs.genSalt(10);
			const newPassword = await bcryptjs.hash(password, salt);

			const updatedUser = await this.userRepository.update(userId, {
				password: newPassword
			});

			return this.formatResponse(updatedUser);
		}
    
    const updated = await this.userRepository.update(userId, { full_name, email });
    return this.formatResponse(updated);
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
