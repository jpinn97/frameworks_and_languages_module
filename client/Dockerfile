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



# # Use a Python base image
# FROM python:3.9

# WORKDIR /app

# # Copy the client code into the container
# COPY . .

# # Expose the port the client will run on
# EXPOSE 8001

# # Command to run the client
# CMD ["python3", "-m", "http.server", "8001"]
