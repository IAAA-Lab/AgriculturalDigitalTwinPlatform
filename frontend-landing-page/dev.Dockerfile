FROM node:13.12.0-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN yarn install
COPY . ./
RUN ["yarn", "run", "build"]

#Then we generate webserver
FROM nginx:latest
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=0 /usr/src/app/build /usr/share/nginx/html