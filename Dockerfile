FROM node:22.18.0-alpine
LABEL name="piny-api"

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . ./
CMD npm -w @piny/api start
