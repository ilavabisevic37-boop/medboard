import { Query, Resolver } from '@nestjs/graphql';

/**
 * Placeholder resolver — code-first GraphQL refuses to start without at least
 * one Query in the schema. Delete this once you add your first real resolver.
 */
@Resolver()
export class PingResolver {
  @Query(() => String)
  ping(): string {
    return 'pong';
  }
}
