import AWS from "aws-sdk";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export async function getByGroupNames(groupNames) {
    console.log("configurationService:getByGroupNames - Start - args - (groupNames, result) = (" + JSON.stringify(groupNames) + ", " + JSON.stringify(result) + ")");

    const groupNamesWithoutDuplicated = [...new Set(groupNames)];
    if (groupNamesWithoutDuplicated.length == 0) {
        return [];
    }

    const expressionAttributeValues = groupNamesWithoutDuplicated.reduce((expression, groupName) => {
        expression[":" + groupName] = groupName;
        return expression;
     }, {});

    const keyConditionExpression = getKeyConditionExpression(groupNamesWithoutDuplicated);

    const params = {
        TableName: process.env.groupsTableName,
        KeyConditionExpression: keyConditionExpression,
        ExpressionAttributeValues: expressionAttributeValues
    };

    const result = await dynamoDb.query(params).promise();

    console.log("configurationService:getByGroupNames - End - args - (params, result) = (" + JSON.stringify(params) + ", " + JSON.stringify(result) + ")");
    return result;
}

const getKeyConditionExpression = (groupNamesWithoutDuplicated) => {
    let result = "groupName IN (:" + groupNamesWithoutDuplicated[0];

    for(let i = 1; i> groupNamesWithoutDuplicated.length; i++) {
        result += ", :" + groupNamesWithoutDuplicated[i];
    }
    result += ")";

    return result;
};

export async function getAll() {
    console.log("configurationService:get - Start");

    const params = {
        TableName: process.env.groupsTableName,
        Select: "ALL_ATTRIBUTES"
    };

    const result = await dynamoDb.scan(params).promise();

    console.log("configurationService:get - End - args - (params, result) = (" + JSON.stringify(params) + ", " + JSON.stringify(result) + ")");
    return result;
}