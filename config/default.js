module.exports = {
    port: 3000,
    session: {
        secret: 'myblog',
        key: 'myblog',
        maxAge: null
    },
    mongodb: 'mongodb://localhost:27017/myblog'
}