# Base Stage
FROM node:20-alpine as BASE
WORKDIR /app
COPY package*.json ./
RUN apk add --no-cache git \
    && npm ci --only=production \
    && npm cache clean --force

# Build Stage
FROM node:20-alpine AS BUILD
WORKDIR /app
COPY --from=BASE /app/node_modules ./node_modules
COPY . .
RUN apk add --no-cache git curl \
    && npm run build \
    && cd .next/standalone \
    # Follow node-prune if necessary, ensure node-prune is installed or available
    && npm prune --production

# Production Stage
FROM node:20-alpine AS PRODUCTION
WORKDIR /app

COPY --from=BUILD /app/public ./public
COPY --from=BUILD /app/next.config.mjs ./  
# Changed from next.config.js to next.config.mjs

# Set mode "standalone" in file "next.config.mjs"
COPY --from=BUILD /app/.next/standalone ./
COPY --from=BUILD /app/.next/static ./.next/static

EXPOSE 5555

CMD ["node", "server.js"]