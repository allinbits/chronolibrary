FROM node:23

WORKDIR /app

RUN apt-get update && apt-get install -y jq sqlite3 && rm -rf /var/lib/apt/lists/*
RUN corepack enable

COPY package.json pnpm-lock.yaml ./
COPY src ./src
COPY tsconfig.json ./tsconfig.json
COPY *data.sqlite ./data.sqlite

RUN pnpm install --no-cache

ENV PORT=${PORT}
EXPOSE ${PORT}

CMD ["pnpm", "start"]