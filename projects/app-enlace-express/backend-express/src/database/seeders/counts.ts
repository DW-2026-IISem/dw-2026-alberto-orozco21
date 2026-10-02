export type SeedCounts = {
  companies: number;
  contacts: number;
  addresses: number;
  messengers: number;
};

export const DEFAULT_SEED_COUNTS: SeedCounts = {
  companies: 15,
  contacts: 15,
  addresses: 15,
  messengers: 15
};

export function resolveSeedCounts(argv: string[] = process.argv.slice(2)): SeedCounts {
  const counts: SeedCounts = { ...DEFAULT_SEED_COUNTS };

  const envCompanies = process.env.SEED_COMPANIES;
  if (envCompanies !== undefined && envCompanies !== "") {
    counts.companies = Number(envCompanies);
  }

  const envMessengers = process.env.SEED_MESSENGERS;
  if (envMessengers !== undefined && envMessengers !== "") {
    counts.messengers = Number(envMessengers);
  }

  for (const arg of argv) {
    const m = arg.match(/^--([a-zA-Z_]+)=(\d+)$/);
    if (!m) continue;
    const key = m[1] as keyof SeedCounts;
    const value = Number(m[2]);
    if (key in counts) {
      counts[key] = value;
    }
  }

  return counts;
}
