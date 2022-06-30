FROM node:13.12.0-alpine as landing
WORKDIR /usr/src/app
COPY frontend-landing-page/package*.json ./
RUN yarn install
COPY frontend-landing-page/ ./
RUN ["yarn", "build-dev"]

FROM node:18.4.0-alpine3.15 as panel
WORKDIR /usr/src/app
COPY digital-twin-panel/package*.json ./
RUN yarn install
COPY digital-twin-panel/ ./
CMD [ "yarn", "build-dev" ]

FROM nginx:latest
COPY nginx/dev.nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=landing /usr/src/app/build /usr/share/nginx/html/lp
COPY --from=panel /usr/src/app/build /usr/share/nginx/html/dtp