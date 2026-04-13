# syntax=docker/dockerfile:1.6
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app
ENV NODE_ENV=production

FROM base AS deps
COPY package.json package-lock.json turbo.json tsconfig.base.json ./
COPY packages/api/package.json ./packages/api/
COPY packages/db/package.json ./packages/db/
COPY packages/shared/package.json ./packages/shared/
RUN npm ci --include=dev --workspaces --include-workspace-root

FROM deps AS build
COPY packages/shared ./packages/shared
COPY packages/db ./packages/db
COPY packages/api ./packages/api
RUN npx prisma generate --schema=packages/db/prisma/schema.prisma \
 && npm run build --workspace=@sophia-werkt/api

FROM base AS runner
RUN addgroup -g 1001 -S nodejs && adduser -S sophia -u 1001
COPY --from=build /app/package.json /app/package-lock.json ./
COPY --from=build /app/packages/api/package.json ./packages/api/
COPY --from=build /app/packages/db/package.json ./packages/db/
COPY --from=build /app/packages/shared/package.json ./packages/shared/
COPY --from=build /app/packages/db/prisma ./packages/db/prisma
RUN npm ci --omit=dev --workspaces --include-workspace-root \
 && npx prisma generate --schema=packages/db/prisma/schema.prisma \
 && npm cache clean --force
COPY --from=build /app/packages/api/dist ./packages/api/dist
COPY --from=build /app/packages/shared ./packages/shared
COPY --from=build /app/packages/db/src ./packages/db/src
USER sophia
EXPOSE 3001
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- http://localhost:3001/health || exit 1
WORKDIR /app/packages/api
CMD ["node", "dist/server.js"]
