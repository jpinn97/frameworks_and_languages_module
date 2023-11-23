FROM node:16
WORKDIR /app/
RUN npm install express cors
COPY *.js .
COPY index.html .
CMD ["node", "server.js"]