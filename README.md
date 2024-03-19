## Project Structure
Dockerized-EcomApp/
├── Db/
│   ├── Dockerfile
│   ├── mongo_root_username.txt
│   └── mongo_root_password.txt
├── Products/
│   ├── Dockerfile
│   └── ...
├── Frontend/
│   ├── Dockerfile
│   └── ...
├── Cart/
│   ├── Dockerfile
│   └── ...
├── Orders/
│   ├── Dockerfile
│   └── ...
├── Gateway/
│   ├── Dockerfile
│   └── ...
└── docker-compose.yml

## Overview
This repository contains a Docker project consisting of multiple services orchestrated using Docker Swarm. 
The project includes services for MongoDB, products, frontend, cart, orders, and gateway, each encapsulated within its own Docker container.

## Getting Started 

To run the project locally, make sure you have Docker and Docker Compose installed on your machine.

- To get started with the project, follow these steps:

1. Clone this repository to your local machine:

    
    git clone https://github.com/GourabGITHUB/Dockerized-EcomApp.git
  

2. Navigate to the project directory:

    cd ecomapp/

3. Build the Docker images and start the services:

    docker-compose up --build -d
    
4. Additionally orchestration can be performed using Docker swarm .

    docker swarm init
    
    docker secret create mongo_root_username ./Db/mongo_root_username.txt
    docker secret create mongo_root_password ./Db/mongo_root_password.txt

    docker stack deploy -c docker-compose.yml <yourstackname>

**important instructions**

    make sure to check the IP address range defined for the subnet to ensure it doesn't overlap with existing networks or cause conflicts and
    modify the credentials for MongoDb as per your requirements and create docker secrets for swarm since secrets are defined externally . 
