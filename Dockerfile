FROM node:14-buster-slim AS builder
LABEL author="Deivid Teixeira"
WORKDIR /usr/app/build
COPY package*.json ./
RUN npm install --quiet
COPY . .
RUN npm run build

FROM node:14-buster-slim
WORKDIR /usr/app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /usr/app/build/dist /usr/app/dist
EXPOSE 3000
VOLUME [ "/usr/app/data" ]
CMD [ "npm", "start" ]