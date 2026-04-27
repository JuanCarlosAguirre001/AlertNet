FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 19000 19001 19002

CMD [ "npx", "expo", "start", "0.0.0.0:8000"]