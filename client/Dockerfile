# Use an official Node runtime as a parent image
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install any dependencies
RUN npm install

# Bundle app source inside the Docker image
COPY . .

# Make port --- available to the world outside this container
EXPOSE 8001

# Command to run the app
CMD ["npm", "run", "dev"]
