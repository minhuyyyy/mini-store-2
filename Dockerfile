FROM node:lts-slim

WORKDIR /app

COPY . .

RUN npm i --force

RUN npm run build

ENV NODE_ENV production

EXPOSE 3000

CMD [ "npx", "serve", "build" ]