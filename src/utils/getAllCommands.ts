import log from './log.js';
import { getAllFiles } from './getAllFiles.js';
import * as path from 'path';
import { pathToFileURL } from 'url';
import axios from 'axios';
import { fileURLToPath } from 'url';

export interface getAllCommandsOptions {
    local?: boolean;
    guild?: string;
}

export default async function getAllCommands (client: any, options: getAllCommandsOptions) {

    const { local, guild } = options;
    let commands: any[] = [];
    
    try{
        if (local) {

            const __filename = fileURLToPath(import.meta.url);
            const __dirname = path.dirname(__filename);
        
            const eventsPath = path.join(__dirname, '..', 'commands');
            const commandFiles = getAllFiles(eventsPath, { extensions: ['.ts', '.js'] });
            
            for (const file of commandFiles) {
                try {

                    const modulePath = file.replace(/\\/g, '/');

                    const absolutePath = path.resolve(process.cwd(), modulePath);

                    const fileUrl = pathToFileURL(absolutePath).href;
                    
                    const commandModule = await import(fileUrl);
                    const command = commandModule.default || commandModule;
                    
                    if (command) {
                        commands.push(command);
                    } else {
                        log.error(`Command ${file} does not have a default export`);
                    }
                } catch (error) {
                    log.error(`Error loading command ${file}: ${error}`);
                }
            }
        }

        if (!local && client) {
            const applicationId = client.user.id;
            const token = client.token;
            const url = guild ? `https://discord.com/api/v9/applications/${applicationId}/guilds/${guild}/commands` : `https://discord.com/api/v9/applications/${applicationId}/commands`;

            try {
                const response = await axios.get(url, {
                    headers: {
                      Authorization: `Bot ${token}`
                    }
                });

                return response.data;
            } catch (error) {
                log.error(`Error getting global commands: ${error}`);
            }
        }

        return commands;
    
    } catch (error) {
        log.error(`Error getting commands: ${error}`);
        return [];
    }
}
