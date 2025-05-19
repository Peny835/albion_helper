import { SlashCommandBuilder, AttachmentBuilder, ChatInputCommandInteraction } from 'discord.js';
import axios from 'axios';
import { Canvas, loadImage } from 'canvas';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { findT8ItemId } from '../../utils/itemFinder.js';

export const data = new SlashCommandBuilder()
        .setName('createbuild')
        .setDescription('Create an Albion Online build image with specified items')
        .addStringOption(option => option.setName('head').setDescription('Head item name or ID').setRequired(true))
        .addStringOption(option => option.setName('armor').setDescription('Armor item name or ID').setRequired(true))
        .addStringOption(option => option.setName('shoes').setDescription('Shoes item name or ID').setRequired(true))
        .addStringOption(option => option.setName('mainhand').setDescription('Main hand item name or ID').setRequired(true))
        .addStringOption(option => option.setName('offhand').setDescription('Off hand item name or ID').setRequired(false))
        .addStringOption(option => option.setName('cape').setDescription('Cape item name or ID').setRequired(false))
        .addStringOption(option => option.setName('bag').setDescription('Bag item name or ID').setRequired(false))
        .addStringOption(option => option.setName('potion').setDescription('Potion item name or ID').setRequired(false))
        .addStringOption(option => option.setName('food').setDescription('Food item name or ID').setRequired(false))
        .addStringOption(option => option.setName('mount').setDescription('Mount item name or ID').setRequired(false))
                
export async function execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();
    
    try {

        const positionMap: Record<string, {x: number, y: number}> = {
            head: { x: 124, y: 2 },
            bag: { x: 6, y: 16 },
            shoes: { x: 124, y: 218 },
            mainhand: { x: 4, y: 124 },
            offhand: { x: 246, y: 124 },
            cape: { x: 246, y: 16 },
            potion: { x: 6, y: 234 },
            food: { x: 246, y: 234 },
            armor: { x: 126, y: 110 },
            mount: { x: 126, y: 332 }
        };

        const items: {[key: string]: string} = {};
        const itemSlots = Object.keys(positionMap);


        for (const slot of itemSlots) {
            const itemInput = interaction.options.getString(slot);
            if (itemInput) {

                if (itemInput.startsWith('T8_')) {
                    items[slot] = itemInput;
                } else {

                    const matches = await findT8ItemId(itemInput);
                    if (matches.length > 0) {

                        items[slot] = matches[0].id;
                        

                        if (matches.length > 1) {
                            console.log(`Multiple matches found for ${itemInput}, using ${matches[0].name}`);
                        }
                    } else {

                        console.log(`No matches found for ${itemInput} in slot ${slot}`);
                    }
                }
            }
        }

        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const pathToFile = path.join(__dirname, '..', '..', 'assets', 'albion');
        
        const baseImagePath = path.join(pathToFile, 'base.png');
        const baseImage = await loadImage(baseImagePath);

        const canvas = new Canvas(baseImage.width, baseImage.height);
        const ctx = canvas.getContext('2d');

        ctx.drawImage(baseImage, 0, 0);
        for (const slot in items) {
            const itemId = items[slot];
            if (!itemId) continue;
            console.log(`Processing item ID: ${itemId} for slot: ${slot}`); 

            const imageUrl = `https://render.albiononline.com/v1/item/${itemId}.png?quality=5&size=128`;
            const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
            
            const position = positionMap[slot as keyof typeof positionMap];

            ctx.drawImage(
                await loadImage(response.data),
                position.x,
                position.y,
                115,
                115
            );
        }

        if (!items.offhand && items.mainhand) {
            const ghostPosition = positionMap['offhand'];
            const mainhandImageUrl = `https://render.albiononline.com/v1/item/${items.mainhand}.png?quality=5&size=128`;
            const ghostResponse = await axios.get(mainhandImageUrl, { responseType: 'arraybuffer' });
            const ghostImage = await loadImage(ghostResponse.data);
        
            ctx.globalAlpha = 0.3;
            ctx.drawImage(ghostImage, ghostPosition.x, ghostPosition.y, 115, 115);
            ctx.globalAlpha = 1.0;
        }

        const buffer = canvas.toBuffer('image/png');
        const attachment = new AttachmentBuilder(buffer, { name: 'build.png' });

        await interaction.editReply({ content: 'Here is your build image:', files: [attachment] });
    } catch (error) {
        console.error('Error creating build image:', error);
        await interaction.editReply('Failed to create build image. Please try again later.');
    }
}

export const config = {
    testOnly: false,
    devOnly: false,
    ownerOnly: false,
    botPermissions: [],
    userPermissions: [],
    cooldown: 10000,
};