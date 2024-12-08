FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY package*.json ./
# Si se requiere NODE_ENV
ENV NODE_ENV=production
RUN npm install --omit=dev
EXPOSE 3000
CMD ["node", "dist/main.js"]
