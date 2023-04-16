FROM node:18.8-alpine as base

FROM base as builder

WORKDIR /home/node/app
COPY package*.json ./

COPY . .

ENV NODE_ENV=production

RUN yarn install --production

EXPOSE 4000

CMD ["node", "index.js"]
