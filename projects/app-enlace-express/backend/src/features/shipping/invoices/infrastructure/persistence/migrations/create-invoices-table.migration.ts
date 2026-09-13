export const createInvoicesTableMigration = {
  name: 'create-invoices-table',
  async up(): Promise<void> {
    // Sequelize sync handles table creation in development.
    // Production: CREATE TABLE invoices (id, companyId FK->companies, number UQ,
    //   periodStart, periodEnd, issueDate, subtotal, taxes, total, status,
    //   paymentDate, createdAt, updatedAt)
  },
  async down(): Promise<void> {
    // Production: DROP TABLE invoices
  },
};
