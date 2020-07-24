'use strict';
const { docClient } = require('./dynamo');

module.exports.handle = async event => {
    var params = {
        TableName: 'usersTable',
        Key: {
            email: event.queryStringParameters.email
        }
    };

    const res = await docClient.get(params);
    if (res.data) {
        return {
            statusCode: 200,
            body: JSON.stringify(res.data),
        };
    }

    return {
        statusCode: 204,
    };
};
