FROM oven/bun:1
WORKDIR /backend
COPY package.json .
RUN bun install 
COPY . . 
EXPOSE 5000
CMD ["bun","index.js"]