export default () => ({
  port: parseInt(process.env.PORT) || 5000,
  database: {
    host: process.env.MONGODB_URI,
  },
});
