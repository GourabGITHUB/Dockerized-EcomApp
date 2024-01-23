#  the official Node.js image as the base image
FROM node:alpine

# Set the working directory in the container
WORKDIR /app

# Install dependencies
RUN npm install express cors

# Copy the rest of the application files to the working directory
COPY . .

# Expose the port on which the application will run
EXPOSE 3000

# Command to run the application
CMD ["node", "orders.js"]
