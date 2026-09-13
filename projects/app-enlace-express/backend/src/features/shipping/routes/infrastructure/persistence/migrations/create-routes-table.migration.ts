export const createRoutesTableMigration = {
  name: 'create-routes-table',
  async up(): Promise<void> {
    // Sequelize sync handles table creation in development.
    // Production: CREATE TABLE routes (id, courierId FK->couriers, name, coverageZone,
    //   date, startTime, endTime, status, isActive, createdAt, updatedAt)
  },
  async down(): Promise<void> {
    // Production: DROP TABLE routes
  },
};
