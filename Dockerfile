FROM node:20.16.0-alpine3.20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

# ENV NODE_ENV=production

CMD ["npm", "run", "dev"]