FROM node:16 as landing-page
WORKDIR /usr/src/app
COPY landing-page/package*.json ./
RUN yarn install
COPY landing-page/ ./
RUN yarn run build-dev

# FROM node:19 as digital-twin
# WORKDIR /usr/src/app
# COPY digital-twin-panel/ ./
# RUN yarn install && yarn run build

FROM nginx:1.23.3
EXPOSE 80
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=landing-page /usr/src/app/build /usr/share/nginx/html/lp
# COPY --from=digital-twin /usr/src/app/dist /usr/share/nginx/html/dtp
