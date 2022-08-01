FROM node:13.12.0-alpine as landing
WORKDIR /usr/src/app
COPY frontend-landing-page/package*.json ./
RUN yarn install
COPY frontend-landing-page/ ./
RUN yarn run build-dev

FROM node:18 as panel
WORKDIR /usr/src/app
COPY digital-twin-panel/package*.json ./
RUN yarn install
COPY digital-twin-panel/ ./
RUN yarn run build-dev

FROM nginx:latest
EXPOSE 80
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=landing /usr/src/app/build /usr/share/nginx/html/lp
COPY --from=panel /usr/src/app/build /usr/share/nginx/html/dtp