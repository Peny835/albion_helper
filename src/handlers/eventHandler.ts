import log from '../utils/log.js';
import { getAllFiles } from '../utils/getAllFiles.js';
import * as path from 'path';
import { pathToFileURL } from 'url';

export default function handleEvents (client: any) {
    const eventFiles = getAllFiles('dist/events', { extensions: ['.js']});

    eventFiles.forEach(async (file: any) => {
        try {
            const modulePath = file.replace(/\\/g, '/');

            const absolutePath = path.resolve(process.cwd(), modulePath);

            const fileUrl = pathToFileURL(absolutePath).href;

            const event = await import(fileUrl);
            const eventExport = event.default || event;

            const eventName = modulePath.split('/').length > 2 ? modulePath.split('/')[2] : '';

            if (!eventExport.execute) {
                log.error(`Event ${modulePath} does not have an execute function`);
                return;
            }

            if (eventExport.once) {
                client.once(eventName, (...args: any) => eventExport.execute(...args, client));
            }

            if (!eventExport.once) {
                client.on(eventName, (...args: any) => eventExport.execute(...args, client));
            }

        } catch (error) {
            log.error(`Error loading event: ${error}`);
        }
    });
}