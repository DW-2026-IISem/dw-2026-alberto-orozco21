export const createShipmentsTableMigration = {
  name: 'create-shipments-table',
  async up(): Promise<void> {
    // Sequelize sync handles table creation in development.
    // Production: CREATE TABLE shipments (id, guideNumber UQ, companyId FK->companies,
    //   originContactId FK->contacts, originAddressId FK->addresses,
    //   destinationContactId FK->contacts, destinationAddressId FK->addresses,
    //   rateId FK->rates, courierId FK->couriers NULL, routeId FK->routes NULL,
    //   invoiceId FK->invoices NULL, priority, totalWeightKg, declaredValue,
    //   calculatedCost, status, requestDate, estimatedDeliveryDate,
    //   actualDeliveryDate, isActive, createdAt, updatedAt)
  },
  async down(): Promise<void> {
    // Production: DROP TABLE shipments
  },
};
