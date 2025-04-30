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
    export async function execute(interaction: any) {
        await interaction.reply({ content: 'Pong!', ephemeral: true });
        console.log(interaction.options.getSubcommandGroup(false));
        console.log(interaction.options.getSubcommand(false));
        console.log(interaction.options.getString('messagse', false));
        console.log(interaction.options.getString('messagse2', false));
    }
    export const config = {
    }