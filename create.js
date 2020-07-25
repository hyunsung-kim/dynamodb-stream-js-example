'use strict';
const { docClient } = require('./dynamo');

module.exports.handle = async (event) => {
  const content = JSON.parse(event.body);
  var params = {
    TableName: 'usersTable',
    Item: {
      "email": content.email,
      "password": content.pwd,
      "region": content.region || "ap-northeast-2"
    }
  };
  const result = await docClient.put(params).promise();
  console.log(result);
  return {
    statusCode: 201,
    body: JSON.stringify(result)
  };
};
