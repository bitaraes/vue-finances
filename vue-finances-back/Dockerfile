FROM node:10.15.3-alpine AS base-stage

WORKDIR /usr/app

COPY package*.json ./

RUN npm i

RUN npm i nodemon@1.18.10

COPY . .