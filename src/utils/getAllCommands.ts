const log = require('./log');
const { getAllFiles } = require('./getAllFiles');
const path = require('path');
import axios from 'axios';

export interface GetAllCommandsOptions {
    local?: boolean;
    guild?: string;
}

export async function GetAllCommands (client: any, options: GetAllCommandsOptions) {

    const { local, guild } = options;
    let commands: any[] = [];
    const commandFiles = getAllFiles('src/commands', '.ts');
    
    try{
    
        if (local) {
    
            commandFiles.forEach((file: any) => {
                const modulePath = path.join(process.cwd(), file);
                try{
                    const command = require(modulePath);
                    if (command.data) {
                        commands.push(command.data.toJSON());
                    } else {
                        log.error(`Command ${file} does not have a data property`);
                    }
                }catch (error) {
                    log.error(`Error loading command ${file}: ${error}`);
                }
                
            });
        }

        if (!local) {

            const applicationId = client.user.id;
            const token = client.token;
            const url = guild ? `https://discord.com/api/v9/applications/${applicationId}/guilds/${guild}/commands` : `https://discord.com/api/v9/applications/${applicationId}/commands`;

            try {

                const response = await axios.get(url, {
                    headers: {
                      Authorization: `Bot ${token}`
                    }
                });

                return response.data

            }catch (error) {
                log.error(`Error getting global commands: ${error}`);
            }
        }
    
        return commands;
    
    }catch (error) {
        log.error(`Error getting commands: ${error}`);
        return [];
    }
}
