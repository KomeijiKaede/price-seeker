FROM node:16

RUN apt-get update && \
  apt-get upgrade -y && \
  apt-get clean && \
  rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json .
COPY yarn.lock .
RUN yarn install && \
  yarn cache clean

COPY entrypoint.sh .
RUN chmod +x entrypoint.sh

COPY src/ src/
COPY nuxt.config.js nuxt.config.js

RUN yarn build

ENTRYPOINT [ "/app/entrypoint.sh" ]
