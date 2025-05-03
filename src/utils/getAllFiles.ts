import * as fs from 'fs';
import * as path from 'path';

export interface GetAllFilesOptions {
  extensions?: string[];
  includeHidden?: boolean;
}

export function getAllFiles(
  dirPath: string, 
  options: GetAllFilesOptions = {}, 
  arrayOfFiles: string[] = []
): string[] {
  const { extensions, includeHidden = false } = options;
  
  try {
    const files = fs.readdirSync(dirPath);

    for (const file of files) {
      if (!includeHidden && file.startsWith('.')) {
        continue;
      }

      const filePath = path.join(dirPath, file);
      
      try {
        const stats = fs.statSync(filePath);
        
        if (stats.isDirectory()) {
          getAllFiles(filePath, options, arrayOfFiles);
        } else {
          if (extensions && extensions.length > 0) {
            const fileExt = path.extname(file).toLowerCase();
            if (extensions.includes(fileExt)) {
              arrayOfFiles.push(filePath);
            }
          } else {
            arrayOfFiles.push(filePath);
          }
        }
      } catch (error) {
        console.error(`Error accessing ${filePath}:`, error);
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dirPath}:`, error);
  }

  return arrayOfFiles;
}