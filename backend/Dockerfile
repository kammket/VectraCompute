# -- Stage 1: Build -----------------------------------------------------------
FROM node:22-slim AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build

# -- Stage 2: Runtime ---------------------------------------------------------
FROM node:22-slim

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=9000

COPY package.json package-lock.json ./
RUN npm install --omit=dev --legacy-peer-deps

COPY --from=builder /app/dist ./dist

EXPOSE 9000

CMD ["npm", "run", "start"]
