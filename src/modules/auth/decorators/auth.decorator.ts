import { applyDecorators, UseGuards } from '@nestjs/common';
import { RoleUser } from '@prisma/client';
import { JwtAuthGuard } from '../guards/auth.guard';
import { OnlyAdminGuard } from '../guards/role-admin.guard';

export const AuthDecorator = (role: RoleUser = RoleUser['USER']) => {
  return applyDecorators(
    (role === 'ADMIN' && UseGuards(JwtAuthGuard, OnlyAdminGuard)) ||
      (role === 'USER' && UseGuards(JwtAuthGuard)),
  );
};
