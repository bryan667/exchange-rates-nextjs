# Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY . .
RUN yarn install --frozen-lockfile
RUN yarn build

# Run
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app ./
EXPOSE 8080
CMD ["yarn", "start", "-p", "8080"]
