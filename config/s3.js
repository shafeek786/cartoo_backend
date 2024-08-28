const AWS = require('aws-sdk');

// Initialize S3 with credentials and region from environment variables
const s3 = new AWS.S3({
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET,
  region: process.env.AWS_REGION,
});

module.exports = s3;
