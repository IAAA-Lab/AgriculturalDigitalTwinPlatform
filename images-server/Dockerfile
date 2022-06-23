FROM node:16
WORKDIR /usr/src/app
COPY package*.json ./
RUN yarn install
COPY . ./
ENV CHOKIDAR_USEPOLLING=true
CMD [ "node", "app.js" ]