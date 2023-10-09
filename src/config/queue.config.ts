export default () => ({
  queue: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
  }
})
