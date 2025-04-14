
import { SlashCommandBuilder  } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Ping!')
    .addStringOption(option => 
        option.setName('message')
            .setDescription('The message to send')
            .setRequired(false)
    )
    .addIntegerOption(option => 
        option.setName('number')
            .setDescription('The number to send')
            .setRequired(false)
    )
    .addBooleanOption(option => 
        option.setName('boolean')
            .setDescription('The boolean to send')
            .setRequired(false)
    )
    .addUserOption(option => 
        option.setName('user')
            .setDescription('The user to send')
            .setRequired(false)
    )
    .addChannelOption(option => 
        option.setName('channel')
            .setDescription('The channel to send')
            .setRequired(false)
    )
    .addRoleOption(option => 
        option.setName('role')
            .setDescription('The role to send')
            .setRequired(false)
    )
    .addAttachmentOption(option => 
        option.setName('attachment')
            .setDescription('The attachment to send')
            .setRequired(false)
    )
    .addMentionableOption(option => 
        option.setName('mentionable')
            .setDescription('The mentionable to send')
            .setRequired(false)
    )
    .addNumberOption(option => 
        option.setName('number')
            .setDescription('The number to send')
            .setRequired(false)
    )
    .addStringOption(option => 
        option.setName('string')
            .setDescription('The string to send')
            .setRequired(false)
    )
    execute: async (interaction: any) => {
        const message = interaction.options.getString('message') || 'Pong!';
        const number = interaction.options.getInteger('number') || 0;
        const boolean = interaction.options.getBoolean('boolean') || false;
        const user = interaction.options.getUser('user') || interaction.user;
        const channel = interaction.options.getChannel('channel') || interaction.channel;
        const role = interaction.options.getRole('role') || null;
        const attachment = interaction.options.getAttachment('attachment') || null;
        const mentionable = interaction.options.getMentionable('mentionable') || null;
        const numberOption = interaction.options.getNumber('number') || 0;
        const stringOption = interaction.options.getString('string') || 'Hello!';
        await interaction.reply(`Pong! ${message} ${number} ${boolean} ${user} ${channel} ${role} ${attachment} ${mentionable} ${numberOption} ${stringOption}`);
    }