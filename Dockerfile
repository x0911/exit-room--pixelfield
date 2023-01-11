FROM node:16

WORKDIR /usr/src/app

COPY . ./
RUN npm install

EXPOSE 8080

ENV HOST=0.0.0.0
ENV PORT=8080

RUN npm run build
RUN npm run generate

CMD [ "npm", "run", "start" ]
