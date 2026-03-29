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
  updates: { time: string; text: string }[];
  organizations: { name: string; url: string }[];
}

export const crisisZones: CrisisZone[] = [
  {
    id: 'gaza',
    name: 'Gaza Strip',
    country: 'Palestine',
    severity: 4,
    funded_percent: 18,
    needed_usd: 920000,
    funded_usd: Math.floor(920000 * 0.18),
    category: 'conflict',
    description: 'Acute humanitarian emergency, critical shortage of food, water, and medical supplies.',
    beneficiaries: 2200000,
    coordinates: [34.308, 31.354],
    updates: [
      { time: '1h ago', text: 'Airstrike reported near Khan Younis, 40+ casualties confirmed' },
      { time: '4h ago', text: 'Aid convoy blocked at Rafah crossing for third consecutive day' },
      { time: '1d ago', text: 'WHO reports critical medicine shortage across all northern hospitals' },
    ],
    organizations: [
      { name: 'Islamic Relief Canada', url: 'https://www.islamicreliefcanada.org' },
      { name: 'Red Cross Canada', url: 'https://www.redcross.ca' },
      { name: 'Doctors Without Borders', url: 'https://www.msf.ca' },
    ],
  },
  {
    id: 'sudan',
    name: 'Darfur Region',
    country: 'Sudan',
    severity: 4,
    funded_percent: 12,
    needed_usd: 780000,
    funded_usd: Math.floor(780000 * 0.12),
    category: 'conflict',
    description: 'Mass displacement and famine conditions affecting millions.',
    beneficiaries: 1800000,
    coordinates: [24.089, 13.527],
    updates: [
      { time: '3h ago', text: 'RSF forces reported attacking civilian settlements near El Fasher' },
      { time: '8h ago', text: 'Over 12,000 newly displaced families arrive at Zamzam camp' },
      { time: '2d ago', text: 'UN warns famine conditions now affecting 5 localities in North Darfur' },
    ],
    organizations: [
      { name: 'Islamic Relief Canada', url: 'https://www.islamicreliefcanada.org' },
      { name: 'UNHCR', url: 'https://www.unhcr.org' },
      { name: 'Human Concern International', url: 'https://www.humanconcern.org' },
    ],
  },
  {
    id: 'somalia',
    name: 'Southern Somalia',
    country: 'Somalia',
    severity: 3,
    funded_percent: 29,
    needed_usd: 640000,
    funded_usd: Math.floor(640000 * 0.29),
    category: 'famine',
    description: 'Persistent drought and food insecurity threatening livelihoods.',
    beneficiaries: 980000,
    coordinates: [42.5, 2.046],
    updates: [
      { time: '2h ago', text: 'Acute malnutrition rates in Bay region reach 30%' },
      { time: '6h ago', text: 'WFP food distribution suspended in 3 districts' },
      { time: '1d ago', text: 'Drought enters 5th consecutive season' },
    ],
    organizations: [
      { name: 'UNICEF Canada', url: 'https://www.unicef.ca' },
      { name: 'Penny Appeal Canada', url: 'https://www.pennyappeal.ca' },
    ],
  },
  {
    id: 'afghanistan',
    name: 'Kandahar Province',
    country: 'Afghanistan',
    severity: 4,
    funded_percent: 9,
    needed_usd: 700000,
    funded_usd: Math.floor(700000 * 0.09),
    category: 'displacement',
    description: 'Remote communities with no aid corridor access, severe malnutrition.',
    beneficiaries: 750000,
    coordinates: [65.7, 31.6],
    updates: [
      { time: '5h ago', text: 'Aid access cut off due to road conditions' },
      { time: '12h ago', text: '1 in 3 children under 5 malnourished' },
    ],
    organizations: [
      { name: 'Islamic Relief Canada', url: 'https://www.islamicreliefcanada.org' },
    ],
  },
  {
    id: 'kashmir',
    name: 'Kashmir Valley',
    country: 'India/Pakistan',
    severity: 2,
    funded_percent: 41,
    needed_usd: 420000,
    funded_usd: Math.floor(420000 * 0.41),
    category: 'displacement',
    description: 'Displaced families in mountain regions with limited winter access.',
    beneficiaries: 310000,
    coordinates: [74.797, 34.083],
    updates: [
      { time: '6h ago', text: 'Heavy snowfall blocks mountain passes' },
    ],
    organizations: [
      { name: 'Human Concern International', url: 'https://www.humanconcern.org' },
    ],
  },
  {
    id: 'yemen',
    name: "Sana'a Governorate",
    country: 'Yemen',
    severity: 4,
    funded_percent: 15,
    needed_usd: 880000,
    funded_usd: Math.floor(880000 * 0.15),
    category: 'conflict',
    description: 'Ongoing blockade causing catastrophic shortages.',
    beneficiaries: 3100000,
    coordinates: [44.191, 15.369],
    updates: [
      { time: '2h ago', text: 'Airstrike hits residential area' },
    ],
    organizations: [
      { name: 'Red Cross Canada', url: 'https://www.redcross.ca' },
    ],
  },

  {
    id: 'rohingya',
    name: "rohingya",
    country: 'Bangladesh',
    severity: 3,
    funded_percent: 38,
    needed_usd: 610000,
    funded_usd: Math.floor(610000 * 0.38),
    category: 'displacement',
    description: "World's largest refugee settlement facing flooding.",
    beneficiaries: 900000,
    coordinates: [92.001, 21.432],
    updates: [
      { time: '2h ago', text: 'Landslides kill 14 refugees after heavy rainfall hits multiple camp zones' },
      { time: '6h ago', text: 'Flooding destroys hundreds of shelters leaving families without housing' },
      { time: '1d ago', text: 'Disease outbreak spreads rapidly with thousands reporting severe diarrhea symptoms' },
    ],
    organizations: [
      { name: 'UNHCR', url: 'https://www.unhcr.org' },
    ],
  },

  {
    id: 'mali',
    name: 'Northern Mali',
    country: 'Mali',
    severity: 3,
    funded_percent: 22,
    needed_usd: 530000,
    funded_usd: Math.floor(530000 * 0.22),
    category: 'conflict',
    description: 'Sahel region conflict displacement.',
    beneficiaries: 420000,
    coordinates: [-1.408, 17.57],
    updates: [
      { time: '4h ago', text: 'Armed clashes leave 27 civilians dead in escalating regional violence' },
      { time: '9h ago', text: 'Militant groups block aid routes cutting off food access to thousands' },
      { time: '2d ago', text: 'Entire villages abandoned as insecurity forces mass displacement' },
    ],
    organizations: [
      { name: 'Red Cross Canada', url: 'https://www.redcross.ca' },
    ],
  },

  {
    id: 'syria',
    name: 'Idlib Province',
    country: 'Syria',
    severity: 3,
    funded_percent: 31,
    needed_usd: 760000,
    funded_usd: Math.floor(760000 * 0.31),
    category: 'conflict',
    description: 'Long-running displacement with deteriorating shelter.',
    beneficiaries: 1400000,
    coordinates: [36.628, 35.93],
    updates: [
      { time: '1h ago', text: 'Airstrikes kill 19 civilians including children and destroy displacement camps' },
      { time: '7h ago', text: 'Severe shortages of shelter leave thousands exposed to freezing conditions' },
      { time: '1d ago', text: 'Medical facilities overwhelmed as injuries surge following bombardment' },
    ],
    organizations: [
      { name: 'Doctors Without Borders', url: 'https://www.msf.ca' },
    ],
  },

  {
    id: 'ethiopia',
    name: 'Tigray Region',
    country: 'Ethiopia',
    severity: 3,
    funded_percent: 26,
    needed_usd: 590000,
    funded_usd: Math.floor(590000 * 0.26),
    category: 'famine',
    description: 'Post-conflict famine recovery.',
    beneficiaries: 830000,
    coordinates: [39.475, 14.033],
    updates: [
      { time: '3h ago', text: 'Starvation deaths reported as food supplies fail to reach remote areas' },
      { time: '10h ago', text: 'Severe child malnutrition rates spike across multiple districts' },
      { time: '2d ago', text: 'Aid shortages worsen as funding gaps delay critical food deliveries' },
    ],
    organizations: [
      { name: 'UNICEF Canada', url: 'https://www.unicef.ca' },
    ],
  },

  {
    id: 'pakistan-floods',
    name: 'Sindh Province',
    country: 'Pakistan',
    severity: 2,
    funded_percent: 55,
    needed_usd: 470000,
    funded_usd: Math.floor(470000 * 0.55),
    category: 'flood',
    description: 'Flood recovery ongoing.',
    beneficiaries: 560000,
    coordinates: [68.354, 25.89],
    updates: [
      { time: '5h ago', text: 'Flash floods kill 11 people and displace hundreds after heavy rainfall' },
      { time: '11h ago', text: 'Contaminated water triggers cholera outbreak in multiple villages' },
      { time: '1d ago', text: 'Families forced to relocate again as floodwaters return to rebuilt areas' },
    ],
    organizations: [
      { name: 'Islamic Relief Canada', url: 'https://www.islamicreliefcanada.org' },
    ],
  },

  {
    id: 'iraq',
    name: 'Mosul District',
    country: 'Iraq',
    severity: 1,
    funded_percent: 67,
    needed_usd: 300000,
    funded_usd: Math.floor(300000 * 0.67),
    category: 'displacement',
    description: 'Post-conflict rebuild nearing completion.',
    beneficiaries: 210000,
    coordinates: [43.159, 36.34],
    updates: [
      { time: '6h ago', text: 'Unexploded ordnance blast kills 6 civilians in residential area' },
      { time: '12h ago', text: 'Economic collapse forces families to abandon rebuilt homes' },
      { time: '2d ago', text: 'Limited job opportunities drive renewed displacement across region' },
    ],
    organizations: [
      { name: 'UNHCR', url: 'https://www.unhcr.org' },
    ],
  },
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
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value}`;
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}
