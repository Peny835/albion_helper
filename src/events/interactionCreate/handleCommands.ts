const { getAllCommands } = require('../../utils/getAllCommands');
import { MessageFlags, PermissionFlagsBits, PermissionsBitField } from 'discord.js';

const cooldowns = new Map<string, Map<string, number>>();


export = {
    once: false,
    async execute(interaction: any, client: any) {
        try {
        if (interaction.isChatInputCommand() === false) return;
        if (interaction.user.bot) return;

        const localCommands = await getAllCommands(null, { local: true });
        const command = localCommands.find((command: any) => command.data.name === interaction.commandName)
        const config = command.config || {};

        if (!command) return await interaction.reply({ content: 'Command not found', flags: MessageFlags.Ephemeral });

        if (config.ownerOnly && interaction.user.id !== process.env.OWNER_ID) {
            return await interaction.reply({ content: 'You are not allowed to use this command.', flags: MessageFlags.Ephemeral });
        }

        if (config.devOnly && process.env.DEVS_ID?.includes(interaction.user.id) === false) {
            return await interaction.reply({ content: 'This command is in development1.', flags: MessageFlags.Ephemeral });
        }

        if (config.testOnly && interaction.guildId !== process.env.TEST_GUILD_ID) {
            return await interaction.reply({ content: 'This command is in development.', flags: MessageFlags.Ephemeral });
        }

        if (config.botPermissions && config.botPermissions.length > 0) {
            const member = await interaction.guild.members.fetch(client.user.id);
            if (!member.permissions.has(config.botPermissions)) {
                const permissionNumber = config.botPermissions;
                const permissions = new PermissionsBitField(permissionNumber);
                const readablePermissions = permissions.toArray().map(permission => {
                  return permission.charAt(0).toUpperCase() + permission.slice(1).toLowerCase().replace(/_/g, ' ');
                });
                return await interaction.reply({ content: `I dont have permissions to run this command: ${readablePermissions}`, flags: MessageFlags.Ephemeral });
            }
        }

        if (config.userPermissions && config.userPermissions.length > 0) {
            const member = await interaction.guild.members.fetch(interaction.user.id);
            if (!member.permissions.has(config.userPermissions)) {
                const permissionNumber = config.userPermissions;
                const permissions = new PermissionsBitField(permissionNumber);
                const readablePermissions = permissions.toArray().map(permission => {
                  return permission.charAt(0).toUpperCase() + permission.slice(1).toLowerCase().replace(/_/g, ' ');
                });
                return await interaction.reply({ content: `You dont have permissions to run this command: ${readablePermissions}`, flags: MessageFlags.Ephemeral });
            }
        }

        const cooldownAmount = config.cooldown || 0;
        if (!cooldowns.has(command.data.name)) {
            cooldowns.set(command.data.name, new Map());
        }
        const now = Date.now(); 
        const timestamps = cooldowns.get(command.data.name)!;
        const cooldownEnd = timestamps.get(interaction.user.id) || 0;

        if (now < cooldownEnd) {
            const timeLeft = ((cooldownEnd - now) / 1000).toFixed(1);
            return await interaction.reply({ content: `Please wait ${timeLeft}s before using this command again.`, flags: MessageFlags.Ephemeral });
        }
        timestamps.set(interaction.user.id, now + cooldownAmount);


        await command.execute(interaction);


    }catch (error) {
        console.error(error);
        await interaction.reply({ content: 'An error occurred while executing the command.', flags: MessageFlags.Ephemeral });
    }
    }

}