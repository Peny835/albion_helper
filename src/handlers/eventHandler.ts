const log = require('../utils/log');
const { getAllFiles } = require('../utils/getAllFiles');

export function handleEvents (client: any) {
    
    const eventFiles = getAllFiles('src/events', '.ts');


    eventFiles.forEach((file: any) => {
        const modulePath = file.replace(/\\/g, '/');
        const event = require(`../../${modulePath}`);
        const eventName = modulePath.split('/')[2]

        if (event.once) {
            client.once(eventName, (...args: any) => event.execute(...args, client));
        }
        if (!event.once) {
            client.on(eventName, (...args: any) => event.execute(...args, client));
        }
    });
}