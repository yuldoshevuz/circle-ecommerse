import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './config/swagger.config';
import * as cors from 'cors';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import { ValidationException } from './common/exceptions/validation.exception';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'path';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(cors());
  app.setGlobalPrefix('api');
  app.useStaticAssets(path.join(process.cwd(), 'public'));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      stopAtFirstError: true,
      exceptionFactory(validationError) {
        const errors = validationError.map(
          ({ property, constraints, children }) => ({
            property,
            constraints,
            children: children.map(({ property, constraints }) => ({
              property,
              constraints,
            })),
          }),
        );

        return new ValidationException(errors);
      },
    }),
  );

  setupSwagger(app);

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
