FROM node:20-alpine AS base
WORKDIR /workspace
RUN apk add --no-cache libc6-compat
RUN corepack enable

FROM base AS deps
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile || pnpm install

FROM base AS build
COPY --from=deps /workspace/node_modules ./node_modules
COPY . .
RUN pnpm exec nx build web --configuration=production

FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /workspace/dist/apps/web ./
EXPOSE 3000
CMD ["node", "server.js"]
