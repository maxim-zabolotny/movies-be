import { format } from 'date-fns';

class Logger {
    private formatMessage(level: string, message: string, meta?: any): string {
        const timestamp = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
        const metaString = meta ? `\nMeta: ${JSON.stringify(meta, null, 2)}` : '';
        return `[${timestamp}] [${level}] ${message}${metaString}`;
    }

    info(message: string, meta?: any): void {
        const formattedMessage = this.formatMessage('INFO', message, meta);
        console.log(formattedMessage);
    }

    error(message: string, error?: any): void {
        const formattedMessage = this.formatMessage('ERROR', message, error);
        console.error(formattedMessage);
    }

    warn(message: string, meta?: any): void {
        const formattedMessage = this.formatMessage('WARN', message, meta);
        console.warn(formattedMessage);
    }

    debug(message: string, meta?: any): void {
        if (process.env.NODE_ENV === 'development') {
            const formattedMessage = this.formatMessage('DEBUG', message, meta);
            console.debug(formattedMessage);
        }
    }
}

export const logger = new Logger();