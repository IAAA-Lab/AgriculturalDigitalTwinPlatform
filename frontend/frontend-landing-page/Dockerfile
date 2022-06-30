FROM node:13.12.0-alpine

WORKDIR /usr/src/app
COPY package*.json ./
RUN yarn install
COPY . ./
ENV CHOKIDAR_USEPOLLING=true
CMD [ "yarn", "start-docker" ]

