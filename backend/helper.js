const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

// Promisify the fs functions to use with async/await
const fsWriteFile = promisify(fs.writeFile);
const fsMkdir = promisify(fs.mkdir);

/**
 * Creates a folder if it doesn't exist
 * @param {string} folderPath - The path of the folder to create
 * @returns {Promise<void>}
 */
async function createFolder(folderPath) {
  try {
    // Check if the directory exists
    if (!fs.existsSync(folderPath)) {
      // Create directory recursively (creates parent directories if needed)
      await fsMkdir(folderPath, { recursive: true });
      console.log(`Created directory: ${folderPath}`);
    }
  } catch (error) {
    console.error(`Error creating directory ${folderPath}:`, error);
    throw error;
  }
}

/**
 * Writes data to a file
 * @param {string} filePath - The path where the file should be saved
 * @param {Buffer|string} data - The data to write to the file
 * @returns {Promise<void>}
 */
async function writeFile(filePath, data) {
  try {
    await fsWriteFile(filePath, data);
    console.log(`Successfully wrote file: ${filePath}`);
  } catch (error) {
    console.error(`Error writing file ${filePath}:`, error);
    throw error;
  }
}

// Export the functions if you're using modules
module.exports = {
  createFolder,
  writeFile
};