# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the application (increase heap for large SSR builds)
ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN pnpm build

# Production stage - Nitro outputs a standalone server, no node_modules needed
FROM node:20-alpine AS runner

WORKDIR /app

# Copy the self-contained Nitro output
COPY --from=builder /app/.output ./.output

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

# Start the Nitro server directly
CMD ["node", ".output/server/index.mjs"]
