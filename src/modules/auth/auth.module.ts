import { Module } from '@nestjs/common';
import { RepositoryModule } from 'src/repositories/repository.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { jwtConfig } from 'src/config/jwt.config';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from './strategies/google.strategy';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: jwtConfig,
    }),
    PassportModule.register({ defaultStrategy: 'google' }),
    ConfigModule,
    RepositoryModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy, ConfigService],
  exports: [AuthService],
})
export class AuthModule {}
