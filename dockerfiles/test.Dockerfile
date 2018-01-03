FROM node:8

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ARG NODE_ENV
COPY package.json /usr/src/app/
RUN npm install -g babel-cli webpack --registry=https://registry.npm.taobao.org
RUN npm install --only=production --registry=https://registry.npm.taobao.org
RUN npm install --only=dev --registry=https://registry.npm.taobao.org
COPY . /usr/src/app

RUN npm install -g mocha --registry=https://registry.npm.taobao.org

ENV NODE_ENV test
RUN webpack

CMD ["npm", "run", "build-install-test"]