FROM node:14-alpine
LABEL name="piny-api"

WORKDIR /app

COPY package*.json .
RUN npm ci --only=production

COPY . .
RUN npm run build

CMD npm start
