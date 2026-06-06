import { join } from 'path';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import type { Request, Response } from 'express';

import { ApplicationsModule } from './modules/applications/applications.module';
import { ChatsModule } from './modules/chats/chats.module';
import { JobsModule } from './modules/jobs/jobs.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { SharedInfrastructureModule } from './shared/infrastructure/shared-infrastructure.module';

/**
 * The ws upgrade request never passes through Express, so cookie-parser does
 * not run for subscriptions — parse the Cookie header by hand.
 */
function parseCookies(header: string | undefined): Record<string, string> {
  if (!header) return {};
  return Object.fromEntries(
    header.split(';').map((pair) => {
      const idx = pair.indexOf('=');
      return [pair.slice(0, idx).trim(), decodeURIComponent(pair.slice(idx + 1).trim())];
    }),
  );
}

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
      // This factory serves BOTH transports:
      //  - HTTP: Apollo calls it with Express's { req, res }; cookie-parser
      //    has already populated req.cookies for SupabaseAuthGuard.
      //  - WS (graphql-ws): @nestjs/graphql passes this same factory to
      //    useServer(), which calls it with the graphql-ws Context — the
      //    upgrade request lives in extra.request and skips Express entirely.
      //    Synthesize a req with parsed cookies so the guard (and
      //    @CurrentUser) work identically over ws.
      context: (ctx: { req?: Request; res?: Response; extra?: { request?: { headers?: Record<string, string> } } }) => {
        if (ctx.req) return { req: ctx.req, res: ctx.res };
        const request = ctx.extra?.request;
        return { req: { headers: request?.headers ?? {}, cookies: parseCookies(request?.headers?.cookie) } };
      },
      // Chat subscriptions ride the same /graphql endpoint over graphql-ws.
      // Auth: the sb-access-token cookie arrives on the upgrade request and is
      // verified per-operation by the global SupabaseAuthGuard (see context
      // factory above). Participation is enforced in ChatsResolver.
      subscriptions: { 'graphql-ws': true },
    }),
    SharedInfrastructureModule,
    UsersModule,
    AuthModule,
    JobsModule,
    ApplicationsModule,
    ChatsModule,
  ],
})
export class AppModule {}
