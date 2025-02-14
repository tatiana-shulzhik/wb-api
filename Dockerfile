FROM node:21

WORKDIR /usr/src/wb-api

COPY package*.json ./
RUN apt-get update && \
    apt-get install -y postgresql-client && \
    rm -rf /var/lib/apt/lists/*

EXPOSE 3000
