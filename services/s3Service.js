const AWS = require('aws-sdk');
const s3 = new AWS.S3({
    signatureVersion: 'v4',
    region: 'eu-central-1'
});

export async function uploadFile(fileName, fileContent) {
    console.log("s3Service:uploadFile - Start - args - (fileName, file) = (" + fileName + ", " + fileContent + ")");

    return s3.upload({
        Bucket: process.env.chequePhotosBucketName,
        Body: fileContent,
        Key: fileName,
    }).promise();
}