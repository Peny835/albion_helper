import 'dotenv/config';
import { Client } from 'discord.js';
const { handleEvents } = require('./handlers/eventHandler');


const client = new Client({
    intents: [
        'Guilds',
        'GuildMessages',
        'MessageContent',
    ],
});

handleEvents(client);

client.login(process.env.BOT_TOKEN)