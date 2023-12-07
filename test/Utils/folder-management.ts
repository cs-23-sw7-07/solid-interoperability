import * as fs from 'fs-extra';

/**
 * Copy a folder and its contents to a destination folder.
 * @param {string} sourcePath - Path of the folder to be copied.
 * @param {string} destinationPath - Path where the folder should be copied to.
 */
async function copyFolder(sourcePath: string, destinationPath: string): Promise<void> {
    try {
        await fs.copy(sourcePath, destinationPath);
        console.log(`Folder copied from ${sourcePath} to ${destinationPath}`);
    } catch (error) {
        const err = error as Error
        console.error(`Error copying folder: ${err.message}`);
    }
}

/**
 * Replace a folder with the contents of another folder and then delete the another folder.
 * @param {string} sourcePath - Path of the folder whose contents should replace the destination folder.
 * @param {string} destinationPath - Path of the folder to be replaced.
 */
async function replaceFolder(sourcePath: string, destinationPath: string): Promise<void> {
    try {
        await fs.remove(destinationPath);
        await fs.copy(sourcePath, destinationPath);
        await fs.remove(sourcePath);
        console.log(`Folder replaced with contents from ${sourcePath} at ${destinationPath}`);
    } catch (error) {
        const err= error as Error;
        console.error(`Error replacing folder: ${err.message}`);
    }
}

async function deleteFolder(path: string): Promise<void> {
    try {
        await fs.remove(path);
        console.log(`Delete folder at ${path}`);
    } catch (error) {
        const err= error as Error;
        console.error(`Error replacing folder: ${err.message}`);
    }
}

// Export the functions, so they can be accessed from other files
export {
    deleteFolder,
    copyFolder,
    replaceFolder
};
