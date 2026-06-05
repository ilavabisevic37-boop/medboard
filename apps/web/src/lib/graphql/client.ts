import { GraphQLClient } from 'graphql-request';

/**
 * Single GraphQL transport for the web app. The API exposes GraphQL at
 * `/graphql` (no `/api` prefix — that prefix only applies to REST routes,
 * which on this app are reserved for the auth module).
 */
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';
const GRAPHQL_URL =
  process.env.NEXT_PUBLIC_GRAPHQL_URL ?? API_URL.replace(/\/api\/?$/, '') + '/graphql';

export const gqlClient = new GraphQLClient(GRAPHQL_URL, {
  // Auth cookies (set by the auth module) ride along once that lands.
  credentials: 'include',
});
