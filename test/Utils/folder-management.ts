import * as fs from 'fs-extra';

/**
 * Copy a folder and its contents to a destination folder.
 * @param {string} sourcePath - Path of the folder to be copied.
 * @param {string} destinationPath - Path where the folder should be copied to.
 */
export async function copyFolder(sourcePath: string, destinationPath: string): Promise<void> {
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
export async function replaceFolder(sourcePath: string, destinationPath: string): Promise<void> {
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

export async function deleteFolder(path: string): Promise<void> {
    try {
        await fs.remove(path);
        console.log(`Delete folder at ${path}`);
    } catch (error) {
        const err= error as Error;
        console.error(`Error replacing folder: ${err.message}`);
    }
}

export async function copyContentOfFolder(source: string, destination: string): Promise<void> {
    try {
      // Ensure the source folder exists
      const sourceExists = await fs.pathExists(source);
      console.log(__dirname);
      if (!sourceExists) {
        console.error(`Source folder '${source}' does not exist.`);
        return;
      }
  
      // Ensure the destination folder exists; create it if not
      await fs.ensureDir(destination);
  
      // Copy the contents of the source folder to the destination folder
      await fs.copy(source, destination, { overwrite: true });
  
      console.log(`Successfully copied contents from '${source}' to '${destination}'.`);
    } catch (error) {
      console.error(`Error copying folder: ${(error as Error).message}`);
    }
  }
