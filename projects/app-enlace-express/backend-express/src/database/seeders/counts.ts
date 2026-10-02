export type SeedCounts = {
  companies: number;
  contacts: number;
  addresses: number;
  messengers: number;
  rates: number;
  routes: number;
  shipments: number;
  packages: number;
  tracking_events: number;
  delivery_proofs: number;
};

export const DEFAULT_SEED_COUNTS: SeedCounts = {
  companies: 15,
  contacts: 15,
  addresses: 15,
  messengers: 15,
  rates: 15,
  routes: 15,
  shipments: 15,
  packages: 15,
  tracking_events: 15,
  delivery_proofs: 15
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

  const envRates = process.env.SEED_RATES;
  if (envRates !== undefined && envRates !== "") {
    counts.rates = Number(envRates);
  }

  const envRoutes = process.env.SEED_ROUTES;
  if (envRoutes !== undefined && envRoutes !== "") {
    counts.routes = Number(envRoutes);
  }

  const envShipments = process.env.SEED_SHIPMENTS;
  if (envShipments !== undefined && envShipments !== "") {
    counts.shipments = Number(envShipments);
  }

  const envPackages = process.env.SEED_PACKAGES;
  if (envPackages !== undefined && envPackages !== "") {
    counts.packages = Number(envPackages);
  }

  const envTrackingEvents = process.env.SEED_TRACKING_EVENTS;
  if (envTrackingEvents !== undefined && envTrackingEvents !== "") {
    counts.tracking_events = Number(envTrackingEvents);
  }

  const envDeliveryProofs = process.env.SEED_DELIVERY_PROOFS;
  if (envDeliveryProofs !== undefined && envDeliveryProofs !== "") {
    counts.delivery_proofs = Number(envDeliveryProofs);
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
