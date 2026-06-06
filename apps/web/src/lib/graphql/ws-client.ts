'use client';

import { createClient, type Client } from 'graphql-ws';

/**
 * graphql-ws client for GraphQL subscriptions (graphql-request can't do
 * subscriptions — queries/mutations stay on `gqlClient`).
 *
 * Auth: the `sb-access-token` httpOnly cookie (set by middleware.ts) rides
 * along on the WebSocket upgrade request — same mechanism the HTTP guard
 * uses. The API side still needs the ws branch wired up (TODO(chats) in
 * app.module.ts / supabase-auth.guard.ts).
 *
 * Browser-only: never import this from a Server Component.
 */
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:3001/api';
const WS_URL =
  process.env.NEXT_PUBLIC_API_WS_URL ??
  API_URL.replace(/^http/, 'ws').replace(/\/api\/?$/, '') + '/graphql';

let client: Client | null = null;

/** Lazy singleton — created on first subscription, reused afterwards. */
export function getWsClient(): Client {
  if (typeof window === 'undefined') {
    throw new Error('ws-client is browser-only; do not use it during SSR');
  }
  client ??= createClient({
    url: WS_URL,
    // Survive API restarts in dev; graphql-ws retries with backoff.
    retryAttempts: 5,
    shouldRetry: () => true,
    // TODO(chats): when the API verifies connectionParams instead of (or in
    // addition to) the cookie, fetch the Supabase session here:
    // connectionParams: async () => ({ authorization: `Bearer ${token}` }),
  });
  return client;
}
