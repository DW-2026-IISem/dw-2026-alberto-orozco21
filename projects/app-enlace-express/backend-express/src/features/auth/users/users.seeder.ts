import { User } from "./user.model";

export const SEED_USERS = [
  { username: "admin", email: "admin@enlace-express.local" },
  { username: "operador", email: "operador@enlace-express.local" },
] as const;

function seedPassword(name: string, localDefault: string): string {
  const configured = process.env[name];
  if (process.env.NODE_ENV === "production" && (!configured || configured.length < 16)) {
    throw new Error(`${name} must be configured with at least 16 characters in production`);
  }
  return configured ?? localDefault;
}

export async function seedUsers(count: number): Promise<number> {
  if (count <= 0) {
    console.log("⏭️  users: count=0, se omite");
    return 0;
  }

  const users = [
    { ...SEED_USERS[0], password: seedPassword("SEED_ADMIN_PASSWORD", "Admin123!") },
    { ...SEED_USERS[1], password: seedPassword("SEED_OPERATOR_PASSWORD", "Operador123!") },
  ];
  const extraPassword =
    count > SEED_USERS.length
      ? seedPassword("SEED_USER_PASSWORD", "Password123!")
      : "Password123!";

  let created = 0;
  for (const item of users) {
    const [, wasCreated] = await User.findOrCreate({
      where: { username: item.username },
      defaults: {
        ...item,
        avatar: null,
        status: "active",
      },
    });
    if (wasCreated) created++;
  }

  for (let index = 0; index < Math.max(0, count - SEED_USERS.length); index++) {
    const username = `user.seed.${index}`;
    const [, wasCreated] = await User.findOrCreate({
      where: { username },
      defaults: {
        username,
        email: `${username}@example.com`,
        password: extraPassword,
        avatar: null,
        status: "active",
      },
    });
    if (wasCreated) created++;
  }

  console.log(`✅ users: insertados ${created} usuario(s) (${SEED_USERS.length} canónicos)`);
  return created;
}
