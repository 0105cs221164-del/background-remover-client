# ── Stage 1: Build React app ──────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# VITE_BACKEND_URL is injected at build time via --build-arg
ARG VITE_BACKEND_URL
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL

RUN npm run build

# ── Stage 2: Serve with Nginx ─────────────────────────
FROM nginx:alpine AS runner

# Copy built files to nginx public folder
COPY --from=builder /app/dist /usr/share/nginx/html

# Custom nginx config to handle React Router
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]