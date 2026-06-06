import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';

import { AppModule } from './app.module';
import { DomainExceptionFilter } from './shared/presentation/domain-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { rawBody: true });

  const isDevelopment = process.env.NODE_ENV === 'development';
  const webOrigin = process.env.WEB_ORIGIN ?? (isDevelopment ? 'http://localhost:3000' : undefined);
  if (!webOrigin) {
    throw new Error('WEB_ORIGIN must be set outside development');
  }

  app.enableCors({
    origin: webOrigin,
    credentials: true,
  });

  app.use(cookieParser());


  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }),
  );
  // Domain invariant violations are 400s, not 500s (works for GraphQL too).
  app.useGlobalFilters(new DomainExceptionFilter());

  // Close the HTTP server (and run module destroy hooks for Prisma/Redis) on the
  // SIGTERM the Nx `@nx/js:node` executor sends when it restarts on file changes.
  // Releasing the port before the process exits prevents the EADDRINUSE race on 3001.
  app.enableShutdownHooks();

  const swagger = new DocumentBuilder()
    .setTitle('MedBoard API')
    .setDescription('Medical jobs board API')
    .setVersion('0.1')
    .build();
  SwaggerModule.setup('api/docs', app, SwaggerModule.createDocument(app, swagger));

  const port = Number(process.env.API_PORT ?? 3001);
  const host = process.env.API_HOST ?? '0.0.0.0';
  await app.listen(port, host);
  // eslint-disable-next-line no-console
  console.log(`🚀 API ready at http://${host}:${port}/api`);
}

bootstrap();
