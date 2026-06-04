import { join } from 'path';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import type { Request, Response } from 'express';

import { ApplicationsModule } from './modules/applications/applications.module';
import { JobsModule } from './modules/jobs/jobs.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { SharedInfrastructureModule } from './shared/infrastructure/shared-infrastructure.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      // Code-first: the SDL schema is generated from the TS resolvers/types.
      autoSchemaFile: join(process.cwd(), 'apps/api/src/schema.gql'),
      sortSchema: true,
      // Disable the legacy playground; use the Apollo Sandbox landing page instead.
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      // Seam for the team's cookie-based auth: req/res are exposed on the
      // GraphQL context so a guard can read the JWT cookie later.
      context: ({ req, res }: { req: Request; res: Response }) => ({ req, res }),
    }),
    SharedInfrastructureModule,
    UsersModule,
    AuthModule,
    JobsModule,
    ApplicationsModule,
  ],
})
export class AppModule {}
