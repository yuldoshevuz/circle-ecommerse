import { Body, Controller, Get, Put, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { RequestWithUser } from 'src/common/interfaces/request-with-user.interface';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RoleUser } from '@prisma/client';
import { AuthDecorator } from '../auth/decorators/auth.decorator';

@Controller('user')
@ApiTags('User')
@AuthDecorator(RoleUser['USER'])
@ApiBearerAuth('accessToken')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async profile(@Req() request: RequestWithUser) {
    return this.userService.profile(request);
  }

	@Put()
  async update(@Req() request: RequestWithUser, @Body() dto: UpdateUserDto) {
    return this.userService.update(request, dto);
  }
}
