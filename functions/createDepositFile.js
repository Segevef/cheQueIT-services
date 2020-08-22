import * as chequesService from '../services/chequesService';
import * as groupConfigurationService from '../services/groupConfigurationService';
import * as fileStructureService from '../services/fileStructureService';
import * as s3Service from '../services/s3Service';

export async function main(event, context) {
  console.log("createDepositFile - Start - args - (event, context) = (" + JSON.stringify(event) + ", " + JSON.stringify(context) + ")");

  let chequesByGroups = [];
  try {
    const groupConfigurations = await groupConfigurationService.getAll();

    if (groupConfigurations.Count == 0) {
      console.error("createDepositFile - no groups exist");
      return;
    }

    for (let groupConfiguration of groupConfigurations.Items) {
      const cheqeuesToDeposit = await chequesService.getChequesToDeposit(groupConfiguration.groupName);

      if (cheqeuesToDeposit.Count === 0) {
        console.log("createDepositFile - no cheques to group - args - (groupConfiguration) = (" + JSON.stringify(groupConfiguration) + ")");
        continue;
      }

      chequesByGroups.push({groupConfiguration, cheqeuesToDeposit : cheqeuesToDeposit.Items});
    }
  } catch (e) {
    console.error("createDepositFile - get chequesToDeposit and groups - Failed by an ERROR:" + e);
    return;
  }

  if (chequesByGroups.length == 0) {
    console.log("createDepositFile - no cheques to deposit today");
    return;
  }

  console.log("createDepositFile - Cheques by groups - args - (chequesByGroups) = (" + JSON.stringify(chequesByGroups) + ")");
  const filesStructures = fileStructureService.getFilesStructure(chequesByGroups);

  try {
    for (let fileStructure of filesStructures) {
      await s3Service.uploadFile("FilesToDeposit/" + fileStructure.fileName, fileStructure.fileContent);
    }
  } catch (e) {
    console.error("createDepositFile - upload files - Failed by an ERROR:" + e);
    return;
  }

  console.log("createDepositFile:run - End - args - (event, context) = (" + JSON.stringify(event) + ", " + JSON.stringify(context) + ")");
}