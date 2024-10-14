import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from 'src/repositories/user.repository';
import { JwtService } from '@nestjs/jwt';
import { AuthResponseDto } from './dto/auth-response.dto';
import { GoogleOauthDto } from './dto/google-oauth.dto';
import { IUser } from 'src/repositories/interfaces/user.interface';
import { RequestWithUser } from 'src/common/interfaces/request-with-user.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async validate(dto: GoogleOauthDto): Promise<IUser> {
    let user = await this.userRepository.findByEmail(dto.email);

    if (!user) {
      user = await this.userRepository.create(dto);
    }

    return user;
  }

  async login(request: RequestWithUser): Promise<AuthResponseDto> {
    const { user } = request;
    if (!user) {
      throw new UnauthorizedException('No user found');
    }

    const accessToken = await this.generateToken(user.id);
    return this.formatResponse(user, accessToken);
  }

  private async generateToken(userId: string): Promise<string> {
    return this.jwtService.signAsync({ user_id: userId });
  }

  private formatResponse(user: IUser, accessToken: string): AuthResponseDto {
    return {
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
      },
      access_token: accessToken,
    };
  }
}
