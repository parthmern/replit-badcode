const AWS = require("aws-sdk");
const dotenv = require("dotenv");
const path = require("path");
const fs = require('fs');



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

                if (filePath) {
                    const getObjectParams = {
                        Bucket: process.env.S3_BUCKET ?? "",
                        Key: filePath
                    };
                    const FILE = await s3.getObject(getObjectParams).promise();
                    console.log(`${filePath} ==> ${JSON.stringify(FILE)}`);

                    // Save the file to the local machine using writeFile
                    const localFilePath = path.join(localPath, filePath);  // Ensure proper directory structure

                    // Ensure the directory exists before writing the file
                    await createFolder(path.dirname(localFilePath)); // Ensure that parent directories exist
                    await writeFile(localFilePath, FILE.Body);
                    console.log(`File saved to ${localFilePath}`);
                }
            }
        }

    } catch (error) {
        console.log(error);
    }
}

function writeFile(filePath, fileData) {
    return new Promise(async (resolve, reject) => {
        try {
            await createFolder(path.dirname(filePath));  // Ensure the folder exists

            fs.writeFile(filePath, fileData, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        } catch (err) {
            reject(err); // Catch any errors during folder creation
        }
    });
}

async function createFolder(dirName) {
    try {
        const stats = await fs.promises.stat(dirName).catch(() => null);

        if (stats) {
            if (stats.isDirectory()) return; // ✅ Already a directory, no need to create

            // ❌ Exists but is a file - Delete it first
            await fs.promises.unlink(dirName);
        }

        // Now, create the directory
        await fs.promises.mkdir(dirName, { recursive: true });
    } catch (err) {
        if (err.code !== "ENOENT") throw err; // ❌ Some other error
        await fs.promises.mkdir(dirName, { recursive: true });
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


