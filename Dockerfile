FROM node:12-alpine AS build-stage
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn
COPY ./src ./src
RUN yarn build

FROM node:12-alpine
RUN apk add git
COPY --from=build-stage /app/dist /app
ENTRYPOINT node /app/index.js