FROM node:20.11.0

WORKDIR /app


COPY package*.json ./

RUN npm install 


COPY . .

EXPOSE 8000

CMD ["npm", "start"]
