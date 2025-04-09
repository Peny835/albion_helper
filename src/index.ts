import 'dotenv/config';
import { Client } from 'discord.js';

const client = new Client({
    intents: [
        'Guilds',
        'GuildMessages',
        'MessageContent',
    ],
});


console.log('Hello, world!');

client.once('ready', (c) => {
    console.log(`Logged in as ${c.user?.tag}`);
});

client.login(process.env.BOT_TOKEN)