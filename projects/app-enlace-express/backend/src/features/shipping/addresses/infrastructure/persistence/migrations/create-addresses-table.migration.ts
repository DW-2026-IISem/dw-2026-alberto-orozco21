export const createAddressesTableMigration = {
  name: 'create-addresses-table',
  async up(): Promise<void> {
    // Sequelize sync handles table creation in development.
    // Production: CREATE TABLE addresses (id, companyId FK->companies, alias, addressLine1,
    //   addressLine2, city, state, country, postalCode, latitude, longitude, type,
    //   isActive, createdAt, updatedAt)
  },
  async down(): Promise<void> {
    // Production: DROP TABLE addresses
  },
};
