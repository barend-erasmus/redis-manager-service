FROM node:6.9.4

RUN npm install pm2 -g

WORKDIR /opt/redis-manager-service

RUN npm install --only=production

CMD ["pm2-docker", "/opt/redis-manager-service/app.js"]