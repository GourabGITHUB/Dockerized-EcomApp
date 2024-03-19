#  the official Node.js image as the base image
FROM node:alpine

# Set the working directory in the container
WORKDIR /app

RUN adduser -D -u 1001 -g 1001 temp

# Copy the rest of the application files to the working directory
COPY package*.json productlist.js .env .

# Install dependencies 
RUN npm install 

# Expose the port on which the application will run
EXPOSE 3001

USER temp

# Command to run the application
CMD ["node", "productlist.js"]

