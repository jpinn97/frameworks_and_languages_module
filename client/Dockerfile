# # Use the official Node.js runtime as a parent image
# FROM node:14

# # Set the working directory in the container
# WORKDIR /usr/src/app

# # Copy package.json and package-lock.json into the container
# COPY package*.json ./

# # Install application dependencies
# RUN npm install

# # Bundle application source into the container
# COPY . .

# # Define the port the app runs on
# EXPOSE 8001

# # Define the command to run the application
# CMD [ "node", "app.js" ]  



FROM node:16

# Set the working directory in the container to /app
WORKDIR /app

# Global install of http-server
RUN npm install -g http-server

# Copy the client code into the container
COPY . .

# Expose the port the client will run on
EXPOSE 8001

# Command to run the client
CMD ["http-server", "--cors", "-p", "8001"]








