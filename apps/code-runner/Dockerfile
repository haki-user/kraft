FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN pnpm run build

CMD ["node", "./dist/index.js"]


