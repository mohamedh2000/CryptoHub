# syntax=docker/dockerfile:1

FROM node:16.13.0
COPY . .
RUN npm install
CMD ["npm", "run", "dev"]
expose 3000
