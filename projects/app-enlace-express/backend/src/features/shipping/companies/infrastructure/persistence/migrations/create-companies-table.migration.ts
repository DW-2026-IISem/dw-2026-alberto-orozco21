export const createCompaniesTableMigration = {
  name: 'create-companies-table',
  async up(): Promise<void> {
    // Sequelize sync handles table creation in development.
    // Production: CREATE TABLE companies (id, nit, razonSocial, isActive, createdAt, updatedAt)
  },
  async down(): Promise<void> {
    // Production: DROP TABLE companies
  },
};
