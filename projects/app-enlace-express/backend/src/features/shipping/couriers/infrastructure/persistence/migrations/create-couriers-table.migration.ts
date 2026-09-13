export const createCouriersTableMigration = {
  name: 'create-couriers-table',
  async up(): Promise<void> {
    // Sequelize sync handles table creation in development.
    // Production: CREATE TABLE couriers (id, name, documentId UQ, phone, vehicleType,
    //   licensePlate, assignedZone, isActive, createdAt, updatedAt)
  },
  async down(): Promise<void> {
    // Production: DROP TABLE couriers
  },
};
