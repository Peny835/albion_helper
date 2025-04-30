import { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Checks the bot\'s latency')
    
export async function execute(interaction: any) {
    const ping = interaction.client.ws.ping;
    const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('Pong!')
        .setDescription(`🏓 Latency: ${ping}ms`)
        .setTimestamp()
        .setFooter({ text: 'Ping command' });
    await interaction.reply({ embeds: [embed] });
    return;
}

export const config = {
        testOnly: false,
        devOnly: false,
        ownerOnly: false,
        botPermissions: [PermissionFlagsBits.SendMessages],
        userPermissions: [PermissionFlagsBits.SendMessages],
        cooldown: 3000,
}
