import { ApplicationCommandOptionData, CommandInteractionOptionResolver } from 'discord.js';
import log from './log.js';

interface CommandOptionChoice {
    name: string;
    value: any;
}

interface CommandOption {
    name: string;
    description: string;
    required?: boolean;
    type: number; 
    choices?: CommandOptionChoice[] | null;
    options?: CommandOption[] | null; 
    min_value?: number | null;
    max_value?: number | null;
    min_length?: number | null;
    max_length?: number | null;
}

interface ApplicationCommand {
    name: string;
    description: string;
    nsfw?: boolean;
    options?: CommandOption[] | null; 
}

interface LocalCommand {
    name: string;
    description: string;
    nsfw?: boolean;
    options?: CommandOption[] | null; 
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
    if (normalizedA.length !== normalizedB.length) {
        log.debug(`Different options length: ${normalizedA.length} !== ${normalizedB.length}`);
        return true;
    }

    const standardize = (value: number | undefined | null): number | null => value === undefined || value === null ? null : value;

    for (let i = 0; i < normalizedA.length; i++) {
        const optA = normalizedA[i];
        const optB = normalizedB[i];

        if (optA.name !== optB.name) {
            log.debug(`Different option name: ${optA.name} !== ${optB.name}`);
            return true;
        }
        if (optA.description !== optB.description) {
            log.debug(`Different option description: ${optA.description} !== ${optB.description}`);
            return true;
        }
        if (isFalsy(optA.required) !== isFalsy(optB.required)) {
            log.debug(`Different option required: ${optA.required} !== ${optB.required}`);
            return true;
        }

        if (standardize(optA.min_value) !== standardize(optB.min_value)) {
            log.debug(`Different option min_value: ${standardize(optA.min_value)} !== ${standardize(optB.min_value)}`);
            return true;
        }
        if (standardize(optA.max_value) !== standardize(optB.max_value)) {
            log.debug(`Different option max_value: ${standardize(optA.max_value)} !== ${standardize(optB.max_value)}`);
            return true;
        }

        if (standardize(optA.min_length) !== standardize(optB.min_length)) {
            log.debug(`Different option min_length: ${standardize(optA.min_length)} !== ${standardize(optB.min_length)}`);
            return true;
        }
        if (standardize(optA.max_length) !== standardize(optB.max_length)) {
            log.debug(`Different option max_length: ${standardize(optA.max_length)} !== ${standardize(optB.max_length)}`);
            return true;
        }

        if (optA.type !== optB.type) {
            log.debug(`Different option type: ${optA.type} !== ${optB.type}`);
            return true;
        }

        const choicesA = normalize(optA.choices) as CommandOptionChoice[] | null;
        const choicesB = normalize(optB.choices) as CommandOptionChoice[] | null;

        if (choicesA || choicesB) {
            if (choicesA == null || choicesB == null || choicesA.length !== choicesB.length) {
                log.debug(`Different option choices length or one is null`);
                return true;
            }

            for (let j = 0; j < choicesA.length; j++) {
                if (choicesA[j].name !== choicesB[j].name || choicesA[j].value !== choicesB[j].value) {
                    log.debug(`Different choice: ${choicesA[j].name} !== ${choicesB[j].name}`);
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
        log.debug(`Different name: ${applicationCommand.name} !== ${localCommand.name}`);
        return true;
    }
    if (applicationCommand.description !== localCommand.description) {
        log.debug(`Different description: ${applicationCommand.description} !== ${localCommand.description}`);
        return true;
    }
    if (isFalsy(applicationCommand.nsfw) !== isFalsy(localCommand.nsfw)) {
        log.debug(`Different nsfw: ${applicationCommand.nsfw} !== ${localCommand.nsfw}`);
        return true;
    }

    return areOptionsDifferent(
        applicationCommand.options as CommandOption[] | undefined | null,
        localCommand.options as CommandOption[] | undefined | null
    );
};

export default function areCommandsDifferent(applicationCommand: ApplicationCommand, localCommand: LocalCommand): boolean {
    return compareCommands(applicationCommand, localCommand);
}
