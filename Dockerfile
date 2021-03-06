FROM node:15-buster-slim AS builder
LABEL author="Deivid Teixeira"
WORKDIR /usr/app/build
COPY package*.json ./
RUN npm install --quiet
COPY . .
RUN npm run build

FROM node:15-buster-slim
WORKDIR /usr/app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /usr/app/build/dist /usr/app/dist
EXPOSE 3000
CMD [ "npm", "start" ]