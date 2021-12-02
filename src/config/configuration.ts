export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  env: process.env.ENV,
  otpExpiration: process.env.OTP_EXPIRATION,
  database: {
    host: process.env.MONGO_HOST,
    port: process.env.MONGO_PORT,
    user: process.env.MONGO_USER,
    pass: process.env.MONGO_PASS,
    db: process.env.MONGO_DB,
  },
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiration: process.env.JWT_EXPIRATION,
  refreshSecret: process.env.REFRESH_SECRET,
  refreshExpiration: process.env.REFRESH_EXPIRATION,
  s3AccessKey: process.env.S3_ACCESS_KEY,
  s3SecretKey: process.env.S3_SECRET_KEY,
  s3Endpoint: process.env.S3_ENDPOINT,
  s3BucketName: process.env.S3_BUCKET_NAME,
  MONGODB_URI: `mongodb://mongo-admin:2581251514fA@127.0.0.1:27017/${process.env.MONGO_DB}-${process.env.ENV}?authMechanism=DEFAULT&authSource=admin`,
});
