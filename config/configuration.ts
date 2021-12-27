export default () => ({
  port: parseInt(process.env.PORT) || 6000,
  database: {
    host: process.env.MONGODB_URI,
  },
});
