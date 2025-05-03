import log from './log.js';
import { getAllFiles } from './getAllFiles.js';
import * as path from 'path';
import { pathToFileURL } from 'url';
import axios from 'axios';

export interface getAllCommandsOptions {
    local?: boolean;
    guild?: string;
}

export default async function getAllCommands (client: any, options: getAllCommandsOptions) {

    const { local, guild } = options;
    let commands: any[] = [];
    
    try{
        if (local) {

            const commandFiles = getAllFiles('dist/commands', { extensions: ['.js'] });
            
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
