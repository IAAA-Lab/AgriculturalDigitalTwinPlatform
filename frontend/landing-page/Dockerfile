FROM node:16 as landing-page
WORKDIR /usr/src/app
COPY package*.json ./
RUN yarn install
COPY . ./
CMD [ "yarn", "start-docker" ]