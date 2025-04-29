import { SlashCommandBuilder  } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName('pong')
    .setDescription('Ping!')
    .addSubcommandGroup(subcommandGroup =>
        subcommandGroup.setName('subgroup')
            .setDescription('Subcommand grosup description')
            .addSubcommand(subcommand =>
                subcommand
                    .setName('subcommands')
                    .setDescription('Subcommand descriptiosn')
                    .addStringOption(option =>
                        option.setName('messsage')
                            .setDescription('The messagse to send')
                            .setRequired(true)
                    )
            )
            .addSubcommand(subcommand =>
                subcommand
                    .setName('subcommands2')
                    .setDescription('Subcommand descriptiosn')
                    .addStringOption(option =>
                        option.setName('messagse2')
                            .setDescription('The messagse to send')
                            .setRequired(false)
                    )
                )
    )
    execute : async (interaction: any) => {
        const message = interaction.options.getString('message') || 'Pong!';
        await interaction.reply(message);
    }