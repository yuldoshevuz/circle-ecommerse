import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepository } from 'src/repositories/user.repository';
import { RegisterUserDto } from './dto/register-user.dto';
import { User } from '@prisma/client';
import * as bcryptjs from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { AuthResponseDto } from './dto/auth-response.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { RequestWithUser } from 'src/common/interfaces/request-with-user.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterUserDto): Promise<AuthResponseDto> {
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(dto.password, salt);

    const newUser = await this.userRepository.create({ ...dto, password: hashedPassword });
		const accessToken = await this.generateToken(newUser.id);

		return this.formatResponse(newUser, accessToken);
  }

	async login(dto: LoginUserDto): Promise<AuthResponseDto> {
		const user = await this.userRepository.findByEmail(dto.email);

		const isMatchPassword = await bcryptjs.compare(dto.password, user.password);
		if (!isMatchPassword) throw new BadRequestException('Incorrect password');

		const accessToken = await this.generateToken(user.id);
		return this.formatResponse(user, accessToken);
	}

  private async generateToken(user_id: string): Promise<string> {
    const token = await this.jwtService.signAsync({ user_id });
    return token;
  }

  private formatResponse(user: User, access_token: string): AuthResponseDto {
    return {
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
				role: user.role,
      },
      access_token,
    };
  }
}
