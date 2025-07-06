FROM oven/bun

WORKDIR /app

COPY . .

RUN bun install && bun run build


FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html

EXPOSE 80
