FROM node:18-alpine as builder
WORKDIR /client

COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine as runner
WORKDIR /client
COPY --from=builder /client/package.json .
COPY --from=builder /client/package-lock.json .
COPY --from=builder /client/next.config.js ./
COPY --from=builder /client/public ./public
COPY --from=builder /client/.next/standalone ./
COPY --from=builder /client/.next/static ./.next/static

EXPOSE 8001

CMD ["npm", "start"]