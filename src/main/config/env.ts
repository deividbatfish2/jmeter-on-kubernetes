export default {
  db: {
    mongoUrl: process.env.MONGO_URL ?? 'mongodb://localhost:27017/jmeter-k8s'
  },
  app: {
    port: process.env.PORT ?? '3000'
  }
}
