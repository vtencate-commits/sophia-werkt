# syntax=docker/dockerfile:1.6
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json turbo.json tsconfig.base.json ./
COPY packages/admin-portal/package.json ./packages/admin-portal/
COPY packages/shared/package.json ./packages/shared/
COPY packages/ui/package.json ./packages/ui/
RUN npm ci --include=dev --workspaces --include-workspace-root

FROM deps AS build
ENV NEXT_TELEMETRY_DISABLED=1
COPY packages/shared ./packages/shared
COPY packages/ui ./packages/ui
COPY packages/admin-portal ./packages/admin-portal
RUN npm run build --workspace=@sophia-werkt/admin-portal

FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001
COPY --from=build /app/package.json /app/package-lock.json ./
COPY --from=build /app/packages/admin-portal/package.json ./packages/admin-portal/
COPY --from=build /app/packages/shared/package.json ./packages/shared/
COPY --from=build /app/packages/ui/package.json ./packages/ui/
RUN npm ci --omit=dev --workspaces --include-workspace-root && npm cache clean --force
COPY --from=build /app/packages/shared ./packages/shared
COPY --from=build /app/packages/ui ./packages/ui
COPY --from=build /app/packages/admin-portal/.next ./packages/admin-portal/.next
COPY --from=build /app/packages/admin-portal/public ./packages/admin-portal/public
COPY --from=build /app/packages/admin-portal/next.config.js ./packages/admin-portal/
USER nextjs
EXPOSE 3003
WORKDIR /app/packages/admin-portal
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD wget -qO- http://localhost:3003/ || exit 1
CMD ["npx", "next", "start", "--port", "3003"]
