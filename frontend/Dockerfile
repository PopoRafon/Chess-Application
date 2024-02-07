FROM node:latest

WORKDIR /app

RUN apt-get update

COPY . /app

RUN npm install

CMD ["npm", "run", "build"]