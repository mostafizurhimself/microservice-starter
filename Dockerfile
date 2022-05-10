FROM node:lts-alpine
RUN mkdir /app && chown -R node:node /app
WORKDIR /app
COPY package.json .
USER node
RUN yarn install
RUN yarn install --only=dev
COPY --chown=node:node . .
CMD ["yarn", "start"]