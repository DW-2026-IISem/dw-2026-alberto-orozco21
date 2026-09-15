export const createTrackingEventsTableMigration = {
  name: 'create-tracking-events-table',
  async up(): Promise<void> {
    // Sequelize sync handles table creation in development.
    // Production: CREATE TABLE tracking_events (id, shipmentId FK->shipments, type,
    //   eventDate, location, observations, severity, recordedByCourierId FK->couriers NULL,
    //   createdAt) -- sin updatedAt: es un log de solo escritura
  },
  async down(): Promise<void> {
    // Production: DROP TABLE tracking_events
  },
};
