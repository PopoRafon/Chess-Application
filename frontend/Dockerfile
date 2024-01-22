FROM node:latest
LABEL Maintainer="PopoRafon"

WORKDIR /app

RUN apt-get update
COPY . /app
RUN npm install

CMD ["npm", "start"]

EXPOSE 80