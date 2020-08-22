import AWS from "aws-sdk";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export async function getChequesToDeposit(groupName) {
    console.log("chequesService:getChequesToDeposit - Start");

    const date = new Date();
    const y = date.getFullYear();
    const m = date.getMonth();
    const firstDay = new Date(y, m, 1).getTime();
    const lastDay = Date.now();
    const params = {
        TableName: process.env.chequesTableName,
        KeyConditionExpression: "groupName = :groupName",
        ExpressionAttributeValues: {
            ":groupName": groupName,
            ":firstDay": firstDay,
            ":lastDay": lastDay,
            ":statusValueApproved" : "approved"
        },
        FilterExpression: "processStatus IN (:statusValueApproved) AND depositDate BETWEEN :firstDay AND :lastDay",
    };

    const result = await dynamoDb.query(params).promise();

    console.log("chequesService:getChequesToDeposit - End - args - (params, result) = (" + JSON.stringify(params) + ", " + JSON.stringify(result) + ")");
    return result;
}

export async function get(params) {
    console.log("chequesService:get - Start - args - (params) = (" + JSON.stringify(params) + ")");

    const result = await dynamoDb.get(params).promise();

    console.log("chequesService:get - End - args - (params, result) = (" + JSON.stringify(params) + ", " + JSON.stringify(result) + ")");
    return result;
}

export async function query(params) {
    console.log("chequesService:query - Start - args - (params) = (" + JSON.stringify(params) + ")");

    const result = await dynamoDb.query(params).promise();

    console.log("chequesService:query - End - args - (params, result) = (" + JSON.stringify(params) + ", " + JSON.stringify(result) + ")");
    return result;
}

export async function update(params) {
    console.log("chequesService:update - Start - args - (params) = (" + JSON.stringify(params) + ")");

    const result = await dynamoDb.update(params).promise();

    console.log("chequesService:update - End - args - (params, result) = (" + JSON.stringify(params) + ", " + JSON.stringify(result) + ")");
    return result;
}