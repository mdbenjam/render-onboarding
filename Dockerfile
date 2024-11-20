FROM node
COPY . .

RUN /bin/sh -c addgroup -g 1000 node

RUN npm install

ENTRYPOINT npm start