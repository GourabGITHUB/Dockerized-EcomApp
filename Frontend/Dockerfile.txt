# Using the official Nginx Alpine image as the base image

FROM nginx:alpine

# Copying HTML files to the Nginx document root

COPY . /usr/share/nginx/html

# Expose port 80, which is the default port for HTTP

EXPOSE 80
