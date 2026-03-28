import { formatUSD } from '@/data/crisisZones';

interface TopBarProps {
  totalZones: number;
  fundingGap: number;
  onMenuToggle?: () => void;
}

export default function TopBar({ totalZones, fundingGap, onMenuToggle }: TopBarProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center justify-between px-4 md:px-6"
      style={{
        background: 'rgba(6,8,16,0.85)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div className="flex items-center gap-3">
        <button className="md:hidden mr-2" onClick={onMenuToggle}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12h18M3 6h18M3 18h18" />
          </svg>
        </button>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-amber">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c1.82 0 3.53-.5 5-1.35C14.15 19.45 12 16.97 12 14c0-4.42 3.58-8 8-8 .34 0 .68.02 1 .07C19.93 3.45 16.22 2 12 2z" fill="currentColor" />
        </svg>
        <div>
          <span className="text-base font-medium tracking-tight">UmmahPulse</span>
          <span className="hidden sm:inline text-[10px] ml-2 opacity-40 uppercase tracking-widest">Live Crisis Intelligence</span>
        </div>
      </div>

      <div className="flex items-center gap-4 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 live-pulse" />
          <span className="text-emerald-400 font-medium">LIVE</span>
        </div>
        <span className="hidden sm:inline opacity-40">{totalZones} Active Zones</span>
        <span className="hidden sm:inline text-amber font-medium">{formatUSD(fundingGap)} Gap</span>
      </div>
    </header>
  );
}
