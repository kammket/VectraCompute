FROM node:22-slim

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=9000

COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build

EXPOSE 9000

CMD ["npm", "run", "start"]
