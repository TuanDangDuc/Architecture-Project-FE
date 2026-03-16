FROM node:18 AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci
RUN npm install @tailwindcss/oxide-linux-x64-gnu
OPY . .

RUN npm run build


FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 3000

ENTRYPOINT ["nginx", "-g", "daemon off;"]
