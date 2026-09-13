import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { seedCompanies } from '../../../features/shipping/companies/infrastructure/persistence/seeders/companies.seeder.js';
import { seedContacts } from '../../../features/shipping/contacts/infrastructure/persistence/seeders/contacts.seeder.js';
import { seedAddresses } from '../../../features/shipping/addresses/infrastructure/persistence/seeders/addresses.seeder.js';
import { seedRates } from '../../../features/shipping/rates/infrastructure/persistence/seeders/rates.seeder.js';
import { seedCouriers } from '../../../features/shipping/couriers/infrastructure/persistence/seeders/couriers.seeder.js';

/**
 * Ejecuta seeders en orden de dependencias.
 * Solo en entornos no productivos.
 */
@Injectable()
export class DatabaseSeederService implements OnModuleInit {
  private readonly logger = new Logger(DatabaseSeederService.name);

  async onModuleInit(): Promise<void> {
    if (process.env.NODE_ENV === 'production') {
      return;
    }

    try {
      await seedCompanies();
      await seedContacts();
      await seedAddresses();
      await seedRates();
      await seedCouriers();
      this.logger.log('✅ Seeders ejecutados');
    } catch (error: any) {
      this.logger.error(`❌ Error en seeders: ${error.message}`, error.stack);
      throw error;
    }
  }
}
