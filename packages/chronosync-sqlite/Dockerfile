FROM node:23-slim

WORKDIR /app

RUN apt-get update && apt-get install -y jq sqlite3 && rm -rf /var/lib/apt/lists/*
RUN corepack enable

COPY src ./src
COPY package.json ./package.json
COPY tsconfig.json ./tsconfig.json
COPY *data.sqlite ./data.sqlite

RUN pnpm install --no-cache

CMD ["pnpm", "start"]