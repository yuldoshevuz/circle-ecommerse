import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export const setupSwagger = (app: INestApplication): void => {
  const config = new DocumentBuilder()
    .addServer(process.env.BASE_URL, 'Production Server')
    .addServer(`http://localhost:${process.env.PORT}`, 'Development Server')
    .setTitle('Circle e-commerse API Docs')
    .setDescription(
      'E-commerse API Docs',
    )
    .setVersion('1.0.0')
    .addTag('Auth')
		.addTag('User')
		.addTag('Navbar')
		.addTag('Product')
		.addTag('Cart')
		.addTag('Order')
		.addTag('Category')
		.addTag('Brand')
		.addTag('Tags')
		.addTag('Promo')
		.addTag('Attribute')		
    .setContact(
      'Muhammadali Yuldoshev',
      'http://yuldoshev.uz',
      'mukhammadaliweb@gmail.com',
    )
    .addBearerAuth({ type: 'http', scheme: 'bearer' }, 'accessToken')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
};