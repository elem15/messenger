FROM node:18.15 as dependencies
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install


FROM node:18.15 as builder
WORKDIR /app
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
RUN npm run build:production


FROM nginx:1.15.9-alpine
ENV NODE_ENV production
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/storybook-static /usr/share/nginx/html
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]