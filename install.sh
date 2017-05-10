# -- BUILD AND INSTALL 'redis-manager' --

# Declare varibles
apidomain=$1
apiport=$2
domain=$3
port=$4

# Update machine package indexes
sudo apt-get update

# Download and run script to install node 7
curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -

# Install node 7
apt-get install -y nodejs

# Install 'typescript' node package
npm install -g typescript

# Install 'gulp' node package
npm install -g gulp

# -- BUILD 'featue-toggle-db' project --

docker run --name redis-manager-db -v /opt/redis-manager-service/mongodb:/data/db -d mongo

# -- BUILD 'redis-manager-service' project --

# Clone 'redis-manager-service' repository
git clone https://github.com/barend-erasmus/redis-manager-service.git

# Change to cloned directory
cd ./redis-manager-service

# Replace domain
sed -i -- "s/yourapidomain.com/$apidomain/g" ./src/config.prod.ts
sed -i -- "s/yourdomain.com/$domain/g" ./src/config.prod.ts

# Replace port
sed -i -- "s/yourapiport/$apiport/g" ./src/config.prod.ts
sed -i -- "s/yourport/$port/g" ./src/config.prod.ts

# Install node packages
npm install

# Build project
npm run build

# Build docker image
docker build --no-cache -t redis-manager-service ./

# Run docker as deamon
docker run -d -p "$apiport":3000 --name redis-manager-service -v /logs:/logs --link redis-manager-db:mongo -t redis-manager-service

cd ~

# -- BUILD 'redis-manager-ui' project --

# Clone 'feature-toggle-ui' repository
git clone https://github.com/barend-erasmus/redis-manager-ui.git

# Change to cloned directory
cd ./redis-manager-ui

# Replace domain
sed -i -- "s/yourapidomain.com/$apidomain/g" ./src/environments/environment.prod.ts

# Replace port
sed -i -- "s/yourapiport/$apiport/g" ./src/environments/environment.prod.ts

# Install node packages
npm install

# Build project
npm run build

# Build docker image
docker build --no-cache -t redis-manager-ui ./

# Run docker as deamon
docker run -d -p "$port":4200 --name redis-manager-ui -t redis-manager-ui
