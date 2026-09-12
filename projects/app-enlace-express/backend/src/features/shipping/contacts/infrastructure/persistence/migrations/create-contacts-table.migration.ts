export const createContactsTableMigration = {
  name: 'create-contacts-table',
  async up(): Promise<void> {
    // Sequelize sync handles table creation in development.
    // Production: CREATE TABLE contacts (id, companyId FK->companies, name, position,
    //   phone, email, isPrimary, isActive, createdAt, updatedAt)
  },
  async down(): Promise<void> {
    // Production: DROP TABLE contacts
  },
};
