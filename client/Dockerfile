FROM node:20-alpine as builder

WORKDIR /app/client

COPY package*.json ./

RUN npm ci

COPY . .

ARG API_URL

ENV API_URL=http://localhost:3000

RUN npm run build

FROM nginx:1.24-alpine

COPY .config/nginx/* /etc/nginx/

COPY .config/nginx/conf.d/default.conf /etc/nginx/conf.d/

COPY --from=builder /app/client/dist /usr/share/nginx/html
