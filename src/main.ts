import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import swaggerConfig from './swagger/config';
import * as swaggerUi from 'swagger-ui-express';
import swaggerJSDoc = require('swagger-jsdoc');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const swaggerSpec = swaggerJSDoc(swaggerConfig);

  app.enableCors();

  app.use(helmet());

  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
