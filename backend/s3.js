const AWS = require("aws-sdk");
const dotenv = require("dotenv");



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

module.exports = {
    copyFileInsideS3
}


