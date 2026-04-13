# syntax=docker/dockerfile:1.6
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json turbo.json tsconfig.base.json ./
COPY packages/client-portal/package.json ./packages/client-portal/
COPY packages/shared/package.json ./packages/shared/
COPY packages/ui/package.json ./packages/ui/
RUN npm ci --include=dev --workspaces --include-workspace-root

FROM deps AS build
ENV NEXT_TELEMETRY_DISABLED=1
COPY packages/shared ./packages/shared
COPY packages/ui ./packages/ui
COPY packages/client-portal ./packages/client-portal
RUN npm run build --workspace=@sophia-werkt/client-portal

FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001
COPY --from=build /app/package.json /app/package-lock.json ./
COPY --from=build /app/packages/client-portal/package.json ./packages/client-portal/
COPY --from=build /app/packages/shared/package.json ./packages/shared/
COPY --from=build /app/packages/ui/package.json ./packages/ui/
RUN npm ci --omit=dev --workspaces --include-workspace-root && npm cache clean --force
COPY --from=build /app/packages/shared ./packages/shared
COPY --from=build /app/packages/ui ./packages/ui
COPY --from=build /app/packages/client-portal/.next ./packages/client-portal/.next
COPY --from=build /app/packages/client-portal/public ./packages/client-portal/public
COPY --from=build /app/packages/client-portal/next.config.js ./packages/client-portal/
USER nextjs
EXPOSE 3000
WORKDIR /app/packages/client-portal
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD wget -qO- http://localhost:3000/ || exit 1
CMD ["npx", "next", "start", "--port", "3000"]
