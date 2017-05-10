export let config = {
    baseUri: 'http://yourapidomain.com',
    port: 'yourapiport',
    web: {
        uri: 'http://yourdomain.com',
        port: 'yourport'
    },
    logging: {
        enabled: false,
        path: '/logs/',
    },
    db: {
        uri: 'mongodb://mongo:27017/redismanagerdb'
    },
};