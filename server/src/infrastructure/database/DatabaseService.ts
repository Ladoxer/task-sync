import { injectable, inject } from 'inversify';
import { MongoClient, Db, Collection } from 'mongodb';
import { TYPES } from '../../types';
import { Logger } from '../../core/logger/Logger';

@injectable()
export class DatabaseService {
  private client: MongoClient | null = null;
  private db: Db | null = null;

  constructor(@inject(TYPES.Logger) private logger: Logger) {}

  async connect(): Promise<void> {
    try {
      const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/task-sync';
      this.client = new MongoClient(uri);
      await this.client.connect();
      this.db = this.client.db();
      this.logger.info('Connected to MongoDB');
    } catch (error) {
      this.logger.error('Failed to connect to MongoDB', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close();
      this.client = null;
      this.db = null;
      this.logger.info('Disconnected from MongoDB');
    }
  }

  getCollection(name: string): Collection {
    if (!this.db) {
      throw new Error('Database not connected');
    }
    return this.db.collection(name);
  }
}