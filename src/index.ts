import 'dotenv/config';
import { Client } from 'discord.js';
import handleEvents from './handlers/eventHandler.js';

const client = new Client({
    intents: [
        'Guilds',
        'GuildMessages',
        'MessageContent',
    ],
});

handleEvents(client);

client.login(process.env.BOT_TOKEN)