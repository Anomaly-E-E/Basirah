import { useState, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { crisisZones, CrisisZone, formatCAD } from '@/data/crisisZones';
import TopBar from '@/components/TopBar';
import LeftSidebar from '@/components/LeftSidebar';
import RightPanel from '@/components/RightPanel';
import BottomLegend from '@/components/BottomLegend';
import CrisisGlobe, { CrisisGlobeHandle } from '@/components/CrisisGlobe';
import DonationBeam from '@/components/DonationBeam';

export default function Index() {
  const [severityFilter, setSeverityFilter] = useState<number | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [selectedZone, setSelectedZone] = useState<CrisisZone | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [beamTarget, setBeamTarget] = useState<[number, number] | null>(null);
  const [donatingZoneName, setDonatingZoneName] = useState('');
  const [donatingAmount, setDonatingAmount] = useState(0);

  const globeRef = useRef<CrisisGlobeHandle>(null);

  const fundingGap = crisisZones.reduce(
    (sum, zone) => sum + (zone.needed_usd - zone.funded_usd),
    0
  );

  const handleZoneClick = useCallback((zone: CrisisZone) => {
    setSelectedZone(zone); 
    globeRef.current?.flyTo(zone.coordinates, 7,800);
  }, []);
 
  const handleCategoryToggle = useCallback((cat: string) => {
    setCategoryFilter((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  }, []);

  const handleDonate = useCallback(
    (type: 'zakat' | 'sadaqah', amount: number) => {
      if (!selectedZone) return;

      const zoneName = selectedZone.name;
      const coords = selectedZone.coordinates;

      setDonatingZoneName(zoneName);
      setDonatingAmount(amount);
      setSelectedZone(null);

      setTimeout(() => {
        globeRef.current?.flyTo([0, 20], 1.8, 1200);
      }, 300);

      setTimeout(() => {
        setBeamTarget(coords);
      }, 1600);
    },
    [selectedZone]
  );

  const handleBeamComplete = useCallback(() => {
    setBeamTarget(null);

    toast(
      `✓ ${formatCAD(donatingAmount)} sent to ${donatingZoneName} — you'll receive verified impact updates`,
      {
        duration: 4000,
        style: {
          background: 'rgba(10,12,20,0.9)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.1)',
          color: 'white',ƒglo
        },
      }
    );
  }, [donatingZoneName, donatingAmount]);

  return (
    <div
      className="w-screen h-screen overflow-hidden"
      style={{ backgroundColor: '#060810' }}
    >
      <TopBar
        totalZones={crisisZones.length}
        fundingGap={fundingGap}
        onMenuToggle={() => setMenuOpen((v) => !v)}
      />

      <LeftSidebar
        severityFilter={severityFilter}
        onSeverityChange={setSeverityFilter}
        categoryFilter={categoryFilter}
        onCategoryToggle={handleCategoryToggle}
        visible={menuOpen}
        onClose={() => setMenuOpen(false)}
        selectedZone={selectedZone}
        onZoneClick={handleZoneClick}
      />

      <RightPanel
        zone={selectedZone}
        onClose={() => setSelectedZone(null)}
        onDonate={handleDonate}
      />

      <BottomLegend />

      <div className="absolute inset-0 pt-14 md:pl-[500px]">
        <CrisisGlobe
          ref={globeRef}
          zones={crisisZones}
          severityFilter={severityFilter}
          categoryFilter={categoryFilter}
          onZoneClick={handleZoneClick}
        />
      </div>

      <DonationBeam
        map={globeRef.current?.getMap() ?? null}
        target={beamTarget}
        onComplete={handleBeamComplete}
      />
    </div>
  );
}