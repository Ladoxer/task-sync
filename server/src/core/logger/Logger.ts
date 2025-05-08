import { injectable } from 'inversify';

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

@injectable()
export class Logger {
  private logWithTime(level: LogLevel, message: string, meta?: any): void {
    const timestamp = new Date().toISOString();
    const metaString = meta ? ` ${JSON.stringify(meta)}` : '';
    console[level](`[${timestamp}] [${level.toUpperCase()}] ${message}${metaString}`);
  }

  info(message: string, meta?: any): void {
    this.logWithTime('info', message, meta);
  }

  warn(message: string, meta?: any): void {
    this.logWithTime('warn', message, meta);
  }

  error(message: string, meta?: any): void {
    this.logWithTime('error', message, meta);
  }

  debug(message: string, meta?: any): void {
    if (process.env.NODE_ENV !== 'production') {
      this.logWithTime('debug', message, meta);
    }
  }
}