FROM node:19
WORKDIR /usr/src/app
COPY . ./
RUN yarn install
CMD ["yarn","run", "dev", "--host"]
# --host is required to make the dev server accessible from outside the container