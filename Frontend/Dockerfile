FROM httpd:alpine

# Set the working directory
WORKDIR /usr/local/apache2/htdocs/

COPY index.html app.js .

RUN apk update && apk add curl

EXPOSE 80