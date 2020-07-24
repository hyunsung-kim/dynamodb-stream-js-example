'use strict';
const { docClient } = require('./dynamo');

module.exports.handle = async event => {

  await accessDB();
  console.log(event);
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Go Serverless v1.0! Your function executed successfully!',
        input: event,
      },
      null,
      2
    ),
  };
};

const accessDB = async () => {
  var params = {
    TableName: 'usersTable',
    Key: {
      email: 'kkd'
    }
  };
  console.log("Calling GetItem");
  docClient.get(params, function (err, data) {
    if (err) console.log(err); // an error occurred
    else console.log(data); // successful response
  });
}
