
# Use the official Node.js 16 image as the base image.
FROM node:16

# Set the working directory inside the container to /app.
WORKDIR /app/

# Install the express and cors npm packages.
RUN npm install express cors

# Copy all JavaScript files from the current directory on the host to the /app/ directory in the container.
COPY *.js .

# Copy the index.html file from the current directory on the host to the /app/ directory in the container.
COPY index.html .

# Command to run when the container starts. In this case, it starts the Node.js server using server.js.
CMD ["node", "server.js"]
