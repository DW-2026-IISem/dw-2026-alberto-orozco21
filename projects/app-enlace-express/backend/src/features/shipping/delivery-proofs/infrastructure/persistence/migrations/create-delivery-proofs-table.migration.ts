export const createDeliveryProofsTableMigration = {
  name: 'create-delivery-proofs-table',
  async up(): Promise<void> {
    // Sequelize sync handles table creation in development.
    // Production: CREATE TABLE delivery_proofs (id, shipmentId FK->shipments UNIQUE,
    //   deliveredAt, receiverName, receiverDocument, signatureUrl, photoUrl,
    //   latitude, longitude, observations, status, createdAt, updatedAt)
  },
  async down(): Promise<void> {
    // Production: DROP TABLE delivery_proofs
  },
};
