# syntax=docker/dockerfile:1

FROM node:18-alpine AS base
ENV NODE_ENV=production
WORKDIR /app

FROM base AS deps
RUN apk add --no-cache libc6-compat
COPY package.json yarn.lock ./
RUN yarn config set registry 'https://registry.npmmirror.com/'
RUN yarn install --frozen-lockfile

FROM deps AS builder
COPY . .
RUN yarn build

FROM node:18-alpine AS runner
ENV NODE_ENV=production
ENV APP_PORT=1314
WORKDIR /app

RUN addgroup -g 1001 nodejs \
    && adduser -S -u 1001 -G nodejs node

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/scripts ./scripts

USER node
EXPOSE 1314

CMD ["node", "./scripts/run-with-migrations.cjs", "node", "server.js"]
