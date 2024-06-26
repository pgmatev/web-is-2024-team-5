FROM node:20-alpine as builder

WORKDIR /app/shared

COPY ./shared .
RUN npm ci
# RUN npm run build

WORKDIR /app/client

COPY ./client/package.json ./client/package-lock.json ./

RUN npm ci

COPY ./client .

ARG API_URL

ENV API_URL=http://localhost:3000

RUN npm run build

FROM nginx:1.24-alpine

COPY ./client/.config/nginx/* /etc/nginx/

COPY ./client/.config/nginx/conf.d/default.conf /etc/nginx/conf.d/

COPY --from=builder /app/client/dist /usr/share/nginx/html
