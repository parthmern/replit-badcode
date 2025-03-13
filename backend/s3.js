const AWS = require("aws-sdk");
const dotenv = require("dotenv");
const path = require("path");
const fs = require('fs');

const {createFolder, writeFile} = require("./helper.js");


dotenv.config();


// Configure AWS SDK
const s3 = new AWS.S3({
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
    region: process.env.S3_REGION
});

// Function to copy file
async function copyFileInsideS3(bucketName, sourceFolder, destinationFolder ) {

    console.log("copyFileInsideS3 triggered");

    try {
        // List all files in the source folder
        const listParams = {
          Bucket: bucketName,
          Prefix: sourceFolder, // Ensure it ends with '/'
        };
    
        const listedObjects = await s3.listObjectsV2(listParams).promise();
        console.log(listedObjects);
    
        if (!listedObjects.Contents.length) {
          console.log("No files found in the source folder.");
          return;
        }
    
        // Copy each file to the new destination
        for (const file of listedObjects.Contents) {
          const sourceKey = file.Key; // Full file path in S3
          const fileName = sourceKey.replace(sourceFolder, ""); // Extract filename
          const destinationKey = `${destinationFolder}${fileName}`; // New path
    
          const copyParams = {
            Bucket: bucketName,
            CopySource: `/${bucketName}/${sourceKey}`,
            Key: destinationKey,
          };
    
          await s3.copyObject(copyParams).promise();
          console.log(`Copied: ${sourceKey} ➝ ${destinationKey}`);
        }
    
        console.log("✅ All files copied successfully!");
      } catch (error) {
        console.error("❌ Error copying files:", error);
      }
    
}

async function fetchAllFilesFromS3AndCopyToLocalMachine(fileName, localPath) {
    try {
        const params = {
            Bucket: process.env.S3_BUCKET ?? "",
            Prefix: fileName
        };

        const allFiles = await s3.listObjectsV2(params).promise();

        if (allFiles.Contents) {
            // PARALLEL downloading and storing into local machine
            for (const [index, file] of allFiles.Contents.entries()) {
                const filePath = file.Key;
                console.log(`${index + 1} FILE -> `, filePath);

                // Skip if the key ends with '/' as it's a directory
                if (filePath && !filePath.endsWith('/')) {
                    const getObjectParams = {
                        Bucket: process.env.S3_BUCKET ?? "",
                        Key: filePath
                    };
                    
                    const FILE = await s3.getObject(getObjectParams).promise();
                    console.log(`${filePath} ==> ${JSON.stringify(FILE)}`);

                    
                    const localFilePath = path.join(localPath, filePath);

                    // Ensure the directory exists before writing the file
                    await createFolder(path.dirname(localFilePath)); // Ensure that parent directories exist
                    
                    // file means (ContentLength > 0)
                    if (FILE.ContentLength > 0) {   
                        await writeFile(localFilePath, FILE.Body);
                        console.log(`File saved to ${localFilePath}`);
                    } else {    
                        // else Folder
                        await createFolder(localFilePath);
                        console.log(`Directory created at ${localFilePath}`);
                    }
                } else {
                    // Handle directory objects
                    const localDirPath = path.join(localPath, filePath);
                    await createFolder(localDirPath);
                    console.log(`Directory created at ${localDirPath}`);
                }
            }
        }

    } catch (error) {
        console.log(error);
    }
}



const saveToS3 = async (key, filePath, content) => {
    const params = {
        Bucket: process.env.S3_BUCKET ?? "",
        Key: `${key}${filePath}`,
        Body: content
    }

    await s3.putObject(params).promise()
}

module.exports = {
    copyFileInsideS3,
    fetchAllFilesFromS3AndCopyToLocalMachine,
    saveToS3
}


