FROM node:18.4.0-alpine3.15

WORKDIR /usr/src/app
COPY package*.json ./
RUN yarn install
COPY . ./
CMD [ "yarn", "build" ]
