import { RoleUser } from '@prisma/client';
import { GoogleOauthDto } from 'src/modules/auth/dto/google-oauth.dto';
import { UpdateUserDto } from 'src/modules/user/dto/update-user.dto';

export interface IUser {
  id: string;
  full_name: string;
  email: string;
  role: RoleUser;
}

export interface CreateUser extends GoogleOauthDto {};

export interface UpdateUser extends UpdateUserDto {};
