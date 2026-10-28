FROM node:26-alpine3.24

WORKDIR /app

COPY package.json yarn.lock ./
RUN npm install -g yarn
RUN apk add --no-cache python3 make gcc g++
RUN yarn

COPY tsconfig.json ./
COPY src ./src

EXPOSE 3000

CMD ["yarn", "dev"]