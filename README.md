# redis-manager-service

![](http://jenkins.developersworkspace.co.za:8080/job/redis-manager-service-nightly/badge/icon)

## Getting Started

Clone the repository

`git clone https://github.com/barend-erasmus/redis-manager-service.git`

Change to cloned directory

`cd ./redis-manager-service`

Install node packages

`npm install`

Start project

`npm start`

Browse `http://localhost:3000/api`


## Docker Setup

`docker run --name redis-manager-db -v /opt/redis-manager-service/mongodb:/data/db -d mongo`

`docker build --no-cache -t redis-manager-service ./`

`docker run -d -p 8080:3000 --name redis-manager-service -v /logs:/logs --link redis-manager-db:mongo -t redis-manager-service`