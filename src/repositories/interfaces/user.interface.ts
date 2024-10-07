import { RoleUser } from '@prisma/client';
import { RegisterUserDto } from 'src/modules/auth/dto/register-user.dto';
import { UpdateUserDto } from 'src/modules/user/dto/update-user.dto';

export interface IUser {
  id: string;
  full_name: string;
  email: string;
  role: RoleUser;
}

export interface CreateUser extends RegisterUserDto {}

export type UpdateUser = Omit<UpdateUserDto, 'old_password'>;
