FROM node:24.11.1-alpine
LABEL name="piny-api"

WORKDIR /app

COPY . ./
RUN npm ci --omit=dev
RUN npm -w @piny/db run migrate

CMD npm -w @piny/api start
