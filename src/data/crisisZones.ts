export interface CrisisZone {
  id: string;
  name: string;
  country: string;
  severity: 1 | 2 | 3 | 4;
  funded_percent: number;
  needed_usd: number;
  funded_usd: number;
  category: 'conflict' | 'famine' | 'displacement' | 'flood' | 'disease';
  description: string;
  beneficiaries: number;
  coordinates: [number, number];
}

export const crisisZones: CrisisZone[] = [
  { id: 'gaza', name: 'Gaza Strip', country: 'Palestine', severity: 4, funded_percent: 18, needed_usd: 48000000, funded_usd: 8640000, category: 'conflict', description: 'Acute humanitarian emergency, critical shortage of food, water, and medical supplies.', beneficiaries: 2200000, coordinates: [34.308, 31.354] },
  { id: 'sudan', name: 'Darfur Region', country: 'Sudan', severity: 4, funded_percent: 12, needed_usd: 32000000, funded_usd: 3840000, category: 'conflict', description: 'Mass displacement and famine conditions affecting millions.', beneficiaries: 1800000, coordinates: [24.089, 13.527] },
  { id: 'somalia', name: 'Southern Somalia', country: 'Somalia', severity: 3, funded_percent: 29, needed_usd: 18000000, funded_usd: 5220000, category: 'famine', description: 'Persistent drought and food insecurity threatening livelihoods.', beneficiaries: 980000, coordinates: [42.500, 2.046] },
  { id: 'afghanistan', name: 'Kandahar Province', country: 'Afghanistan', severity: 4, funded_percent: 9, needed_usd: 24000000, funded_usd: 2160000, category: 'displacement', description: 'Remote communities with no aid corridor access, severe malnutrition.', beneficiaries: 750000, coordinates: [65.700, 31.600] },
  { id: 'kashmir', name: 'Kashmir Valley', country: 'India/Pakistan', severity: 2, funded_percent: 41, needed_usd: 9000000, funded_usd: 3690000, category: 'displacement', description: 'Displaced families in mountain regions with limited winter access.', beneficiaries: 310000, coordinates: [74.797, 34.083] },
  { id: 'yemen', name: "Sana'a Governorate", country: 'Yemen', severity: 4, funded_percent: 15, needed_usd: 41000000, funded_usd: 6150000, category: 'conflict', description: 'Ongoing blockade causing catastrophic food and medicine shortages.', beneficiaries: 3100000, coordinates: [44.191, 15.369] },
  { id: 'rohingya', name: "Cox's Bazar Camps", country: 'Bangladesh', severity: 3, funded_percent: 38, needed_usd: 22000000, funded_usd: 8360000, category: 'displacement', description: "World's largest refugee settlement facing flooding and disease.", beneficiaries: 900000, coordinates: [92.001, 21.432] },
  { id: 'mali', name: 'Northern Mali', country: 'Mali', severity: 3, funded_percent: 22, needed_usd: 14000000, funded_usd: 3080000, category: 'conflict', description: 'Sahel region conflict displacement with low international visibility.', beneficiaries: 420000, coordinates: [-1.408, 17.570] },
  { id: 'syria', name: 'Idlib Province', country: 'Syria', severity: 3, funded_percent: 31, needed_usd: 29000000, funded_usd: 8990000, category: 'conflict', description: 'Long-running displacement with deteriorating shelter and medical access.', beneficiaries: 1400000, coordinates: [36.628, 35.930] },
  { id: 'ethiopia', name: 'Tigray Region', country: 'Ethiopia', severity: 3, funded_percent: 26, needed_usd: 17000000, funded_usd: 4420000, category: 'famine', description: 'Post-conflict famine recovery, access routes partially reopened.', beneficiaries: 830000, coordinates: [39.475, 14.033] },
  { id: 'pakistan-floods', name: 'Sindh Province', country: 'Pakistan', severity: 2, funded_percent: 55, needed_usd: 11000000, funded_usd: 6050000, category: 'flood', description: 'Flood recovery ongoing, damaged infrastructure and crop loss.', beneficiaries: 560000, coordinates: [68.354, 25.890] },
  { id: 'iraq', name: 'Mosul District', country: 'Iraq', severity: 1, funded_percent: 67, needed_usd: 7000000, funded_usd: 4690000, category: 'displacement', description: 'Post-conflict rebuild nearing completion, returnee support needed.', beneficiaries: 210000, coordinates: [43.159, 36.340] },
];

export const severityColors: Record<number, string> = {
  4: '#CC2200',
  3: '#D44000',
  2: '#E8A020',
  1: '#2E8B57',
};

export const categoryColors: Record<string, string> = {
  conflict: '#CC2200',
  famine: '#E8A020',
  displacement: '#4A90D9',
  flood: '#2ECCAA',
  disease: '#9B59B6',
};

export function formatUSD(value: number): string {
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(1)}B`;
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(value);
}

export function formatCAD(value: number): string {
  return new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}

export function toGeoJSON(zones: CrisisZone[]) {
  return {
    type: 'FeatureCollection' as const,
    features: zones.map(z => ({
      type: 'Feature' as const,
      properties: {
        id: z.id,
        name: z.name,
        country: z.country,
        severity: z.severity,
        funded_percent: z.funded_percent,
        needed_usd: z.needed_usd,
        funded_usd: z.funded_usd,
        category: z.category,
        description: z.description,
        beneficiaries: z.beneficiaries,
      },
      geometry: {
        type: 'Point' as const,
        coordinates: z.coordinates,
      },
    })),
  };
}
