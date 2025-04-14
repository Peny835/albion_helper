
const log = require('../../utils/log');

export = {

    once: true,
    execute(client: any) {
        
    log.info(`Client Name: ${client.user.username}`);
    log.info(`Client ID: ${client.user.id}`);

    }

}