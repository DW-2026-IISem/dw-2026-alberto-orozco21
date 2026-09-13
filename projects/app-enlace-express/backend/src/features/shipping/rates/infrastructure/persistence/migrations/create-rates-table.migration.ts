export const createRatesTableMigration = {
  name: 'create-rates-table',
  async up(): Promise<void> {
    // Sequelize sync handles table creation in development.
    // Production: CREATE TABLE rates (id, name, zone, calculationRule, baseValue,
    //   additionalValuePerKg, urgentSurchargePct, validFrom, validUntil, isActive,
    //   createdAt, updatedAt)
  },
  async down(): Promise<void> {
    // Production: DROP TABLE rates
  },
};
