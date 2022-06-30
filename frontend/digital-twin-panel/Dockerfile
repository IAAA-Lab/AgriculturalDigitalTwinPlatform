FROM node:18.4.0-alpine3.15

WORKDIR /usr/src/app
COPY package*.json ./
RUN yarn install
COPY . ./
ENV CHOKIDAR_USEPOLLING=true
CMD [ "yarn", "start-docker" ]

