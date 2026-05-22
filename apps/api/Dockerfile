FROM node:20-alpine AS base
WORKDIR /workspace
RUN apk add --no-cache libc6-compat openssl
RUN corepack enable

FROM base AS deps
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml ./
COPY apps/api/prisma ./apps/api/prisma
RUN pnpm install --frozen-lockfile || pnpm install

FROM base AS build
COPY --from=deps /workspace/node_modules ./node_modules
COPY . .
RUN pnpm exec prisma generate --schema=apps/api/prisma/schema.prisma
RUN pnpm exec nx build api --configuration=production

FROM node:20-alpine AS runtime
WORKDIR /app
RUN apk add --no-cache openssl
ENV NODE_ENV=production
COPY --from=build /workspace/dist/apps/api ./
COPY --from=build /workspace/apps/api/prisma ./prisma
COPY --from=build /workspace/node_modules ./node_modules
EXPOSE 3001
CMD ["node", "main.js"]
