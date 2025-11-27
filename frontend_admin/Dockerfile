FROM node:22-alpine
WORKDIR /admin
COPY package*.json ./
RUN npm ci && npm cache clean --force
COPY . .
RUN npm run build
EXPOSE 5174
CMD ["npx", "serve", "-s", "dist", "-l", "5174"]