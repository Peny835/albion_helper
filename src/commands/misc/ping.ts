import { SlashCommandBuilder  } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName('pong')
    .setDescription('Ping!')
    .addStringOption(option => 
        option.setName('message')
            .setDescription('The message to send')
            .setRequired(false)
    )
    execute : async (interaction: any) => {
        const message = interaction.options.getString('message') || 'Pong!';
        await interaction.reply(message);
    }