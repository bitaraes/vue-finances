FROM node:18.12-alpine3.15

WORKDIR /usr/app

COPY package*.json ./

RUN npm install yarn

RUN yarn install

COPY . .

EXPOSE 4000

CMD ["npm", "start"]