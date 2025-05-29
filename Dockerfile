FROM node:24-alpine

WORKDIR /IT-Freelancer/backend-nestjs

COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .

RUN npm run build

CMD ["node", "dist/main"]