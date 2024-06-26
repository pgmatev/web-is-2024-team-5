FROM node:20-alpine

WORKDIR /app/shared

COPY ./shared ./
RUN npm ci
# RUN npm run build

WORKDIR /app/server

COPY ./server/package.json ./server/package-lock.json ./

RUN npm ci

COPY ./server .

EXPOSE 3000
ARG MONGODB_URI
ENV MONGODB_URI=${MONGODB_URI}
ENV JWT_SECRET=${JWT_SECRET}
ENV JWT_EXPIRE=${JWT_EXPIRE}

CMD ["npm", "start"]


# app
#  /server/dockerfile
#  /client/dockerfile
#  /shared