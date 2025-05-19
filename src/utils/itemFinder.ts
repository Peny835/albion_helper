import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

/**
 * Interface for the items mapping
 */
interface ItemsMap {
    [key: string]: string;
}

/**
 * Function to find T8 item IDs by name
 * 
 * @param searchTerm - The item name to search for
 * @returns A Promise that resolves to an array of matched items with their IDs
 */
export async function findT8ItemId(searchTerm: string): Promise<{id: string, name: string}[]> {
    // Get the path to items.json
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const itemFile = path.join(__dirname, '..', 'assets', 'albion', 'items.json');

    // Read and parse the items data
    const itemsData: ItemsMap = JSON.parse(await fs.readFile(itemFile, 'utf8'));
    
    // Filter for T8 items and items matching the search term
    const searchTermLower = searchTerm.toLowerCase();
    const matches = Object.entries(itemsData)
        .filter(([id, name]) => {
            // Check if it's a T8 item (starts with T8_)
            const isT8 = id.startsWith('T8_');
            // Check if the name contains the search term (case insensitive)
            const nameMatch = name.toLowerCase().includes(searchTermLower);
            return isT8 && nameMatch;
        })
        .map(([id, name]) => ({ id, name }));
    
    return matches;
}

/**
 * Function to get all available T8 items
 * 
 * @returns A Promise that resolves to an array of all T8 items with their IDs
 */
export async function getAllT8Items(): Promise<{id: string, name: string}[]> {
    // Get the path to items.json
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const itemFile = path.join(__dirname, '..', 'assets', 'albion', 'items.json');

    // Read and parse the items data
    const itemsData: ItemsMap = JSON.parse(await fs.readFile(itemFile, 'utf8'));
    
    // Filter for only T8 items
    const t8Items = Object.entries(itemsData)
        .filter(([id]) => id.startsWith('T8_'))
        .map(([id, name]) => ({ id, name }));
    
    return t8Items;
}