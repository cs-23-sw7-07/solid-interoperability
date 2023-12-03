const fs = require('fs-extra');

/**
 * Copy a folder and its contents to a destination folder.
 * @param {string} sourcePath - Path of the folder to be copied.
 * @param {string} destinationPath - Path where the folder should be copied to.
 */
async function copyFolder(sourcePath, destinationPath) {
  try {
    await fs.copy(sourcePath, destinationPath);
    console.log(`Folder copied from ${sourcePath} to ${destinationPath}`);
  } catch (error) {
    console.error(`Error copying folder: ${error.message}`);
  }
}

/**
 * Replace a folder with the contents of another folder and then delete the another folder.
 * @param {string} sourcePath - Path of the folder whose contents should replace the destination folder.
 * @param {string} destinationPath - Path of the folder to be replaced.
 */
async function replaceFolder(sourcePath, destinationPath) {
  try {
    await fs.remove(destinationPath);
    await fs.copy(sourcePath, destinationPath);
    await fs.remove(sourcePath);
    console.log(`Folder replaced with contents from ${sourcePath} at ${destinationPath}`);
  } catch (error) {
    console.error(`Error replacing folder: ${error.message}`);
  }
}

// Export the functions, so they can be accessed from other files
module.exports = {
  copyFolder,
  replaceFolder
};
