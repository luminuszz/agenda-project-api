FROM node:alpine

# Set working directory
WORKDIR /usr/app

# Copy package.json to working directory

COPY . .

# Install dependencies

RUN corepack enable

RUN corepack prepare pnpm@latest --activate

RUN pnpm install

RUN pnpm run build

EXPOSE 3000

CMD ["pnpm", "run", "start:prod"]



