'use strict';

const { docClient } = require('./dynamo');

module.exports.handle = async (event) => {
    const records = event.Records;
    records.forEach(async (r) => {
        const opType = r.eventName;
        const dynamodb = r.dynamodb;
        console.log(dynamodb);
        switch (opType) {
            case "INSERT":
                const {
                    email,
                    region
                } = dynamodb.NewImage;
                console.log(`${email.S}, ${region.S}`);
                var params = {
                    TableName: 'routeTable',
                    Item: {
                        "email": email.S,
                        "region": region && region.S || 'ap-northeast-2'
                    }
                };
                const result = await docClient.put(params).promise();
                console.log(result);
                break;
            case "MODIFY":
                // TODO: operations
                break;
            case "REMOVE":
                // TODO: operations
                break;
        }
    });
};
