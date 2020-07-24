'use strict';

const AWS = require('aws-sdk');
exports.docClient = new AWS.DynamoDB.DocumentClient({
  region: 'localhost',
  endpoint: 'http://localhost:8000',
  accessKeyId: 'DEFAULT_ACCESS_KEY',
  secretAccessKey: 'DEFAULT_SECRET'
});
