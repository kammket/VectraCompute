# ── Stage 1: Build ────────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

# Copy manifests first to leverage layer caching
COPY package.json package-lock.json ./

# Use --legacy-peer-deps to resolve peer-dependency conflicts and sync the
# lock file without requiring a perfectly clean npm ci run
RUN npm install --legacy-peer-deps

# Copy the rest of the source
COPY . .

# Compile TypeScript and bundle the Medusa admin dashboard
RUN npm run build

# ── Stage 2: Runtime ──────────────────────────────────────────────────────────
FROM node:22-alpine AS runtime

WORKDIR /app

# Copy only what is needed to run the server
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.medusa ./.medusa

EXPOSE 9000

CMD ["npm", "run", "start"]
