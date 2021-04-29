FROM node:14-alpine3.13

COPY ./ /usr/src/app/

WORKDIR /usr/src/app/

RUN mkdir files && npm install

CMD ["npm", "start"]