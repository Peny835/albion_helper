import { ApplicationCommandOptionData, CommandInteractionOptionResolver } from 'discord.js';
import log from './log';

// Define interfaces based on usage
interface CommandOptionChoice {
    name: string;
    value: any; // Value type can vary
}

// Use ApplicationCommandOptionData from discord.js if possible, or define a similar interface
// Assuming a structure similar to discord.js ApplicationCommandOptionData
interface CommandOption {
    name: string;
    description: string;
    required?: boolean;
    type: number; // Use ApplicationCommandOptionType enum values if using discord.js
    choices?: CommandOptionChoice[] | null;
    options?: CommandOption[] | null; // For nested options/subcommands
    // Add other potential properties based on discord.js or your specific needs
    min_value?: number | null;
    max_value?: number | null;
    min_length?: number | null;
    max_length?: number | null;
}

// Assuming ApplicationCommand structure similar to discord.js fetched commands
interface ApplicationCommand {
    name: string;
    description: string;
    nsfw?: boolean;
    options?: CommandOption[] | null; // Use ApplicationCommandOptionData[] if possible
}

// Update LocalCommand structure - remove the 'data' wrapper
interface LocalCommand {
    name: string;
    description: string;
    nsfw?: boolean;
    options?: CommandOption[] | null; // Use ApplicationCommandOptionData[] if possible
    // Include other properties if getAllCommands returns them, e.g., execute function
    // execute?: (client: any, interaction: any) => Promise<void>; // Example
}

function normalize(value: any[] | null | undefined | unknown): any[] | unknown | null {
    if (value === null || value === undefined || (Array.isArray(value) && value.length === 0)) {
        return null;
    }
    return value;
}

function isFalsy(value: unknown): boolean {
    return value === undefined || value === null || value === false;
}

function areOptionsDifferent(optionsA: CommandOption[] | undefined | null, optionsB: CommandOption[] | undefined | null): boolean {
    const normalizedA = normalize(optionsA) as CommandOption[] | null;
    const normalizedB = normalize(optionsB) as CommandOption[] | null;

    if (normalizedA == null && normalizedB == null) {
        return false;
    }
    if (normalizedA == null || normalizedB == null) {
        return true;
    }
    // Now we know both are non-null arrays
    if (normalizedA.length !== normalizedB.length) {
        log.debug(`Different options length: ${normalizedA.length} !== ${normalizedB.length}`); // Debugging length mismatch
        return true;
    }

    const standardize = (value: number | undefined | null): number | null => value === undefined || value === null ? null : value;

    for (let i = 0; i < normalizedA.length; i++) {
        const optA = normalizedA[i];
        const optB = normalizedB[i];

        if (optA.name !== optB.name) {
            log.debug(`Different option name: ${optA.name} !== ${optB.name}`); // Debugging name mismatch
            return true;
        }
        if (optA.description !== optB.description) {
            log.debug(`Different option description: ${optA.description} !== ${optB.description}`); // Debugging description mismatch
            return true;
        }
        if (isFalsy(optA.required) !== isFalsy(optB.required)) {
            log.debug(`Different option required: ${optA.required} !== ${optB.required}`); // Debugging required mismatch
            return true;
        }

        // Standardize min_value and max_value before comparison
        if (standardize(optA.min_value) !== standardize(optB.min_value)) {
            log.debug(`Different option min_value: ${standardize(optA.min_value)} !== ${standardize(optB.min_value)}`); // Debugging min_value mismatch
            return true;
        }
        if (standardize(optA.max_value) !== standardize(optB.max_value)) {
            log.debug(`Different option max_value: ${standardize(optA.max_value)} !== ${standardize(optB.max_value)}`); // Debugging max_value mismatch
            return true;
        }

        // Standardize min_length and max_length before comparison
        if (standardize(optA.min_length) !== standardize(optB.min_length)) {
            log.debug(`Different option min_length: ${standardize(optA.min_length)} !== ${standardize(optB.min_length)}`); // Debugging min_length mismatch
            return true;
        }
        if (standardize(optA.max_length) !== standardize(optB.max_length)) {
            log.debug(`Different option max_length: ${standardize(optA.max_length)} !== ${standardize(optB.max_length)}`); // Debugging max_length mismatch
            return true;
        }

        if (optA.type !== optB.type) {
            log.debug(`Different option type: ${optA.type} !== ${optB.type}`); // Debugging type mismatch
            return true;
        }


        const choicesA = normalize(optA.choices) as CommandOptionChoice[] | null;
        const choicesB = normalize(optB.choices) as CommandOptionChoice[] | null;

        if (choicesA || choicesB) {
            if (choicesA == null || choicesB == null || choicesA.length !== choicesB.length) {
                log.debug(`Different option choices length or one is null`); // Debugging choices mismatch
                return true;
            }

            for (let j = 0; j < choicesA.length; j++) {
                if (choicesA[j].name !== choicesB[j].name || choicesA[j].value !== choicesB[j].value) {
                    log.debug(`Different choice: ${choicesA[j].name} !== ${choicesB[j].name}`); // Debugging choice mismatch
                    return true;
                }
            }
        }


        if (areOptionsDifferent(optA.options, optB.options)) {
            return true;
        }
    }

    return false;
}


const compareCommands = (applicationCommand: ApplicationCommand, localCommand: LocalCommand): boolean => {

    if (applicationCommand.name !== localCommand.name) {
        log.debug(`Different name: ${applicationCommand.name} !== ${localCommand.name}`); // Debugging name mismatch
        return true;
    }
    if (applicationCommand.description !== localCommand.description) {
        log.debug(`Different description: ${applicationCommand.description} !== ${localCommand.description}`); // Debugging description mismatch
        return true;
    }
    if (isFalsy(applicationCommand.nsfw) !== isFalsy(localCommand.nsfw)) {
        log.debug(`Different nsfw: ${applicationCommand.nsfw} !== ${localCommand.nsfw}`); // Debugging nsfw mismatch
        return true;
    }


    return areOptionsDifferent(
        applicationCommand.options as CommandOption[] | undefined | null,
        localCommand.options as CommandOption[] | undefined | null
    );
};


module.exports = {
    areCommandsDifferent: compareCommands 
};