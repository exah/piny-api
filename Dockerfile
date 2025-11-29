FROM node:24.11.1-alpine
LABEL name="piny-api"

WORKDIR /app

COPY . ./
RUN apk update && apk add bash
RUN npm ci --omit=dev

CMD npm -w @piny/api start
