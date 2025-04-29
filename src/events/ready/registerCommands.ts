const { getAllCommands } = require("../../utils/getAllCommands");
const { areCommandsDifferent } = require("../../utils/areCommandsDiffrent");
const log = require("../../utils/log");
const axios = require("axios");


export = {
    once: true,
    async execute(client: any) {
        const guild = process.env.TEST_GUILD_ID || null;
        try{
            const localCommands = await getAllCommands(client, { local: true });
            const slashCommands = await getAllCommands(client, { local: false, guild: guild});
        

                for (const command of localCommands) {
    
                    const match = slashCommands.find((c: any) => c.name === command.name);

                    if (match) {
                        if (areCommandsDifferent(match, command)) {
                            
                            try {
                                await axios.patch(guild ? `https://discord.com/api/v9/applications/${client.user.id}/guilds/${guild}/commands/${match.id}` : `https://discord.com/api/v9/applications/${client.user.id}/commands/${match.id}`, command, {
                                    headers: {
                                        Authorization: `Bot ${client.token}`,
                                    }
                                }).then((response: any) => {
                                    if (response.status === 200) {
                                        log.success(`Command ${command.name} updated`);
                                    }
                                    else {
                                        log.error(`Error updating command ${command.name}: ${response.statusText}`);
                                    }
                                })
                            }catch (error) {
                                log.error(`Error updating command ${command.name}: ${error}`);
                            }
        
                        } else {
                            log.success(`Command ${command.name} is up to date`);
                        }
                        continue;
                    } else {
                        try {
                            await axios.post(guild ? `https://discord.com/api/v9/applications/${client.user.id}/guilds/${guild}/commands` : `https://discord.com/api/v9/applications/${client.user.id}/commands`, command, {
                                headers: {
                                    Authorization: `Bot ${client.token}`,
                                    "Content-Type": "application/json"
                                }
                            }).then((response: any) => {
                                if (response.status === 201) {
                                    log.success(`Command ${command.name} registered`);
                                }
                                else {
                                    log.error(`Error registering command ${command.name}: ${response.statusText}`);
                                }
                            })
                        }catch (error) {
                            log.error(`Error registering command ${command.name}: ${error}`);
                        }
                    }
                }
        
                
                for (const slashCommand of slashCommands) {
                    
                    const localMatch = localCommands.find((c: any) => c.name === slashCommand.name);
        
                    if (!localMatch) {
                        
                        await axios.delete(guild ? `https://discord.com/api/v9/applications/${client.user.id}/guilds/${guild}/commands/${slashCommand.id}` : `https://discord.com/api/v9/applications/${client.user.id}/commands/${slashCommand.id}`, {
                            headers: {
                                Authorization: `Bot ${client.token}`,
                                "Content-Type": "application/json"
                            }}).then((response: any) => {
                                if (response.status === 204) {
                                    log.warn(`Command ${slashCommand.name} deleted`);
                                }
                                else {
                                    log.error(`Error deleting command ${slashCommand.name}: ${response.statusText}`);
                                }
                            })
                        }
        
                    }
        }catch (error) {
            log.error(`Error registering commands: ${error}`);
        }
    }
}

