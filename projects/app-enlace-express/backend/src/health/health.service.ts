import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class HealthService {
  constructor(@InjectConnection() private readonly sequelize: Sequelize) {}

  async check() {
    let database: 'up' | 'down' = 'down';
    try {
      await this.sequelize.authenticate();
      database = 'up';
    } catch {
      database = 'down';
    }
    return {
      status: database === 'up' ? 'ok' : 'degraded',
      app: 'enlace-express-api',
      database,
      timestamp: new Date().toISOString(),
    };
  }
}
