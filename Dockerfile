FROM node:16-alpine
WORKDIR /home/app
COPY ./dist /home/app/dist
COPY ./node_modules /home/app/node_modules
EXPOSE 3000
ENTRYPOINT [ "node", "dist/main.js" ]