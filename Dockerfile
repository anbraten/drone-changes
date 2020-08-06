FROM node:12-alpine AS build-stage
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn
COPY ./src ./src
RUN yarn build

FROM node:12-alpine
WORKDIR /app
COPY --from=build-stage /app/dist .
ENTRYPOINT ["node"]
CMD ["index.js"]