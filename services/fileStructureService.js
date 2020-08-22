export function getFilesStructure(chequesByGroups) {
    console.log("fileStructureService:getFilesStructure - Start - args - (chequesByGroups) = (" + JSON.stringify(chequesByGroups) + ")");

    const results = [];
    for (let currChequesByGroups of chequesByGroups) {
        const fileContent = getContent(currChequesByGroups.groupConfiguration, currChequesByGroups.cheqeuesToDeposit);
        const fileName = getFileName(currChequesByGroups.groupConfiguration);
        results.push({fileName, fileContent});
    }

    console.log("fileStructureService:getFilesStructure - End - args - (chequesByGroups, results) = (" + JSON.stringify(chequesByGroups) + ", " + JSON.stringify(results) + ")");
    return results;
}

const getContent = (groupConfiguration, groupCheques) => {
    console.log("fileStructureService:getContent - Start - args - (groupConfiguration, groupCheques) = (" + JSON.stringify(groupConfiguration) + ", " + JSON.stringify(groupCheques) + ")");
    let content = groupConfiguration.accountNumber + "," + groupConfiguration.bankCode + "," +
        groupConfiguration.branchCode + "," + groupConfiguration.accountType;

    groupCheques.forEach(cheque => {
        content += "\n" + cheque.chequeNum + "," + cheque.accountNumber + "," + cheque.bankCode + ","
            + cheque.branchCode + "," + cheque.amount + "," + cheque.depositDate + "," + cheque.code;
    });

    console.log("fileStructureService:getContent - End - args - (groupConfiguration, groupCheques, content) = (" + JSON.stringify(groupConfiguration) + ", " + JSON.stringify(groupCheques) + ", " + JSON.stringify(content) + ")");
    return content;
};

const getFileName = (groupConfiguration) => {
    const date = new Date();
    const months = [1,2,3,4,5,6,7,8,9,10,11,12];
    return date.getDate() + "." +  months[date.getMonth()] + "." +  date.getFullYear() +  groupConfiguration.groupName +  date.getHours() + ":" + date.getMinutes() + "." + groupConfiguration.bankCode;
};