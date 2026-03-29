import { useRef, useEffect } from 'react';
import { crisisZones, CrisisZone, severityColors, categoryColors, formatUSD, formatNumber } from '@/data/crisisZones';

const severityFilters = [
  { label: 'All', value: 'all' },
  { label: 'Critical', value: 4 },
  { label: 'High', value: 3 },
  { label: 'Medium', value: 2 },
  { label: 'Recovering', value: 1 },
] as const;

const categoryFilters = ['conflict', 'famine', 'flood', 'displacement', 'disease'] as const;

interface LeftSidebarProps {
  severityFilter: number | 'all';
  onSeverityChange: (val: number | 'all') => void;
  categoryFilter: string[];
  onCategoryToggle: (cat: string) => void;
  visible: boolean;
  onClose?: () => void;
  selectedZone: CrisisZone | null;
  onZoneClick: (zone: CrisisZone) => void;
}

export default function LeftSidebar({
  severityFilter,
  onSeverityChange,
  categoryFilter,
  onCategoryToggle,
  visible,
  onClose,
  selectedZone,
  onZoneClick,
}: LeftSidebarProps) {
  const zones = crisisZones;
  const gap = zones.reduce((s, z) => s + (z.needed_usd - z.funded_usd), 0);
  const listRef = useRef<HTMLDivElement>(null);

  const filteredZones = zones.filter(z => {
    const sevMatch = severityFilter === 'all' || z.severity === severityFilter;
    const catMatch = categoryFilter.length === 0 || categoryFilter.includes(z.category);
    return sevMatch && catMatch;
  });

  const severityCounts = [4, 3, 2, 1].map(sev => ({
    sev,
    count: zones.filter(z => z.severity === sev).length,
  }));

  const sevLabels: Record<number, { label: string; color: string }> = {
    4: { label: 'Critical', color: '#CC2200' },
    3: { label: 'High', color: '#D44000' },
    2: { label: 'Medium', color: '#E8A020' },
    1: { label: 'Recovering', color: '#2E8B57' },
  };

  // Scroll to selected zone
  useEffect(() => {
    if (selectedZone && listRef.current) {
      const el = listRef.current.querySelector(`[data-zone-id="${selectedZone.id}"]`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [selectedZone]);

  return (
    <>
      {visible && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={onClose} />}
      <aside
      style={{ background: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(12px)' }}
      className={`fixed top-14 left-0 bottom-0 z-40 w-[500px] glass-panel flex flex-col transition-transform duration-300 ${
                visible ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >

        {/* Stats */}
        <div className="p-5 pb-0 space-y-3 flex-shrink-0">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] opacity-40 mb-1">Live Crises</p>
            <p className="text-4xl font-light">{zones.length}</p>
          </div>
          <div className="h-px bg-white/[0.08]" />
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] opacity-40 mb-1">Total Funding Gap</p>
            <p className="text-2xl font-medium text-amber">{formatUSD(gap)}</p>
          </div>
          <div className="h-px bg-white/[0.08]" />
          <div className="space-y-1.5">
            {severityCounts.map(({ sev, count }) => (
              <div key={sev} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: sevLabels[sev].color }} />
                  <span className="opacity-70">{sevLabels[sev].label}</span>
                </div>
                <span style={{ color: sevLabels[sev].color }} className="font-medium">{count}</span>
              </div>
            ))}
          </div>
          <div className="h-px bg-white/[0.08]" />

          {/* Severity filter */}
          <div className="space-y-2">
            <p className="text-[10px] uppercase tracking-[0.2em] opacity-40">Severity</p>
            <div className="flex flex-wrap gap-1.5">
              {severityFilters.map(f => {
                const active = severityFilter === f.value;
                return (
                  <button
                    key={f.label}
                    onClick={() => onSeverityChange(f.value)}
                    className={`px-3 py-1 rounded-full text-xs transition-colors ${
                      active
                        ? 'bg-white/[0.14] text-white border border-white/25'
                        : 'text-white/50 hover:bg-white/[0.08] border border-transparent'
                    }`}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category filter */}
          <div className="space-y-2 pb-3">
            <p className="text-[10px] uppercase tracking-[0.2em] opacity-40">Category</p>
            <div className="flex flex-wrap gap-1.5">
              {categoryFilters.map(cat => {
                const active = categoryFilter.includes(cat);
                return (
                  <button
                    key={cat}
                    onClick={() => onCategoryToggle(cat)}
                    className={`px-3 py-1 rounded-full text-xs capitalize transition-colors ${
                      active
                        ? 'bg-white/[0.14] text-white border border-white/25'
                        : 'text-white/50 hover:bg-white/[0.08] border border-transparent'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="h-px bg-white/[0.08]" />
        </div>

        {/* Crisis list */}
        <div ref={listRef} className="flex-1 overflow-y-auto px-3 py-2 space-y-1.5 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {filteredZones.map(zone => {
            const isSelected = selectedZone?.id === zone.id;
            return (
              <button
                key={zone.id}
                data-zone-id={zone.id}
                onClick={() => onZoneClick(zone)}
                className="w-full text-left rounded-lg p-3 transition-colors"
                style={{
                  borderLeft: `${isSelected ? 3 : 2}px solid ${severityColors[zone.severity]}`,
                  background: isSelected ? 'rgba(255,255,255,0.1)' : 'transparent',
                }}
                onMouseEnter={e => {
                  if (!isSelected) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)';
                }}
                onMouseLeave={e => {
                  if (!isSelected) (e.currentTarget as HTMLElement).style.background = 'transparent';
                }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-[14px] text-white font-medium truncate">{zone.name}</p>
                    <p className="text-[12px] text-white/40">{zone.country}</p>
                  </div>
                  <span
                    className="text-[10px] px-2 py-0.5 rounded-full capitalize whitespace-nowrap flex-shrink-0"
                    style={{
                      backgroundColor: `${categoryColors[zone.category]}22`,
                      color: categoryColors[zone.category],
                    }}
                  >
                    {zone.category}
                  </span>
                </div>
                <div className="mt-2 h-1 rounded-full bg-white/[0.08] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${zone.funded_percent}%`,
                      backgroundColor: zone.funded_percent < 30 ? '#E8A020' : zone.funded_percent < 60 ? '#EAD040' : '#2E8B57',
                    }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </aside>
    </>
  );
}
