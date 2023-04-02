FROM node:18.15.0-alpine
LABEL name="piny-api"

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . ./
CMD npm start
