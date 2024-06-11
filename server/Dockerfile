FROM node:19-alpine

WORKDIR /app/server
COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 3000
ARG MONGODB_URI
ENV MONGODB_URI=${MONGODB_URI}

CMD ["npm", "start"]
