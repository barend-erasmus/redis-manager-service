export let config = {
    baseUri: 'http://localhost',
    port: '3000',
    web: {
        uri: 'http://localhost',
        port: '4200'
    },
    logging: {
        enabled: true,
        path: './',
    },
    db: {
        uri: 'mongodb://localhost:27017/redismanagerdb'
    },
};