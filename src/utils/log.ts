import chalk from "chalk";

function getDate() {
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
    };
    const formattedDate = date.toLocaleString("pl", options).replace(/, /g, " ");
    return chalk.gray(`[${formattedDate}]`);
}

function log(...args: any[]) {
    const date = getDate();
    console.log(date, chalk.white(`[LOG]`), ...args);
}

function error(...args: any[]) {
    const date = getDate();
    console.log(date, chalk.red(`[ERROR]`), ...args);
}

function warn(...args: any[]) {
    const date = getDate();
    console.log(date, chalk.yellow(`[WARN]`), ...args);
}

function info(...args: any[]) {
    const date = getDate();
    console.log(date, chalk.blue(`[INFO]`), ...args);
}

function debug(...args: any[]) {
    const date = getDate();
    console.log(date, chalk.cyan(`[DEBUG]`), ...args);
}

function success(...args: any[]) {
    const date = getDate();
    console.log(date, chalk.green(`[SUCCESS]`), ...args);
}


module.exports = {
    log,
    error,
    warn,
    info,
    debug,
    success
};