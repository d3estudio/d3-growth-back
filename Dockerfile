FROM node:12.10.0
RUN mkdir -p /home/node/app && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY package*.json ./
RUN npm install
COPY . .
COPY --chown=node:node . .
USER node
CMD ["node", "server.js"]