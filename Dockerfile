# Stage 1: Build
FROM --platform=$BUILDPLATFORM node:22.21-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production
FROM --platform=$BUILDPLATFORM node:22.21-alpine AS production
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist ./dist
EXPOSE 4000
CMD ["node", "dist/asada-lisboa-frontend/server/server.mjs"]
