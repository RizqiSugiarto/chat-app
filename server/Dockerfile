FROM node:16-alpine AS builder
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .

ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

RUN npm run prisma:updateSchema  
RUN npm run build

FROM node:16-alpine
WORKDIR /app
COPY --from=builder /app/package.json /app/package-lock.json /app/
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/prisma /app/prisma 
# RUN npm install 
EXPOSE 8000

CMD ["npm", "start"]