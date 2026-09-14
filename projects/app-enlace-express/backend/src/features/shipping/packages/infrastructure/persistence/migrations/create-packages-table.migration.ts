export const createPackagesTableMigration = {
  name: 'create-packages-table',
  async up(): Promise<void> {
    // Sequelize sync handles table creation in development.
    // Production: CREATE TABLE packages (id, shipmentId FK->shipments,
    //   contentDescription, weightKg, heightCm, widthCm, lengthCm, declaredValue,
    //   isFragile, isActive, createdAt, updatedAt)
  },
  async down(): Promise<void> {
    // Production: DROP TABLE packages
  },
};
