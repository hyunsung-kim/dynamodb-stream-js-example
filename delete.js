'use strict';
const { docClient } = require('./dynamo');

module.exports.handle = async (event) => {
  const content = JSON.parse(event.body);
  var params = {
    TableName: 'usersTable',
    Key: {
      "email": content.email
    }
  };
  const result = await docClient.delete(params).promise();
  console.log(result);
  return {
    statusCode: 204
  };
};
