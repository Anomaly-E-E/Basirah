import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users } from 'lucide-react';
import { CrisisZone, severityColors, categoryColors, formatUSD, formatNumber } from '@/data/crisisZones';

const QUICK_AMOUNTS = [10, 25, 50, 100];

interface RightPanelProps {
  zone: CrisisZone | null;
  onClose: () => void;
  onDonate: (type: 'zakat' | 'sadaqah', amount: number) => void;
}

export default function RightPanel({ zone, onClose, onDonate }: RightPanelProps) {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');

  const amount = selectedAmount ?? (parseFloat(customAmount) || 0);

  // Reset when zone changes
  useEffect(() => {
    setSelectedAmount(null);
    setCustomAmount('');
  }, [zone?.id]);

  const fundColor = (pct: number) =>
    pct < 30 ? '#E8A020' : pct < 60 ? '#EAD040' : '#2E8B57';

  return (
    <AnimatePresence>
      {zone && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={onClose} />

          <motion.aside
            initial={{ x: 320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 320, opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed top-14 right-0 bottom-0 w-[320px] z-40 glass-panel p-5 overflow-y-auto hidden md:flex flex-col gap-4"
          >
            <PanelContent
              zone={zone} onClose={onClose} onDonate={onDonate} fundColor={fundColor}
              selectedAmount={selectedAmount} setSelectedAmount={setSelectedAmount}
              customAmount={customAmount} setCustomAmount={setCustomAmount} amount={amount}
            />
          </motion.aside>

          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: '40%' }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 z-50 glass-panel rounded-t-2xl p-5 overflow-y-auto md:hidden flex flex-col gap-4"
            style={{ maxHeight: '60vh' }}
          >
            <PanelContent
              zone={zone} onClose={onClose} onDonate={onDonate} fundColor={fundColor}
              selectedAmount={selectedAmount} setSelectedAmount={setSelectedAmount}
              customAmount={customAmount} setCustomAmount={setCustomAmount} amount={amount}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function PanelContent({
  zone, onClose, onDonate, fundColor,
  selectedAmount, setSelectedAmount, customAmount, setCustomAmount, amount,
}: {
  zone: CrisisZone;
  onClose: () => void;
  onDonate: (type: 'zakat' | 'sadaqah', amount: number) => void;
  fundColor: (pct: number) => string;
  selectedAmount: number | null;
  setSelectedAmount: (v: number | null) => void;
  customAmount: string;
  setCustomAmount: (v: string) => void;
  amount: number;
}) {
  return (
    <>
      <div className="flex justify-between items-start">
        <span
          className="text-[11px] px-2.5 py-0.5 rounded-full font-medium uppercase tracking-wider"
          style={{
            backgroundColor: `${categoryColors[zone.category]}22`,
            color: categoryColors[zone.category],
          }}
        >
          {zone.category}
        </span>
        <button onClick={onClose} className="opacity-50 hover:opacity-100 transition-opacity">
          <X size={16} />
        </button>
      </div>

      <div>
        <h2 className="text-xl font-medium">{zone.name}</h2>
        <p className="text-[13px] opacity-40">{zone.country}</p>
      </div>

      <div className="flex gap-1.5">
        {[1, 2, 3, 4].map(i => (
          <span
            key={i}
            className="w-2.5 h-2.5 rounded-full"
            style={{
              backgroundColor: i <= zone.severity ? severityColors[zone.severity] : 'rgba(255,255,255,0.1)',
            }}
          />
        ))}
      </div>

      <div className="h-px bg-white/[0.08]" />

      <div>
        <div className="flex justify-between text-[11px] uppercase tracking-wider mb-2">
          <span className="opacity-40">Funded</span>
          <span style={{ color: fundColor(zone.funded_percent) }} className="font-medium">
            {zone.funded_percent}%
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-white/[0.08] overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${zone.funded_percent}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-full rounded-full"
            style={{ backgroundColor: fundColor(zone.funded_percent) }}
          />
        </div>
        <p className="text-[12px] opacity-40 mt-1.5">
          {formatUSD(zone.funded_usd)} raised of {formatUSD(zone.needed_usd)} goal
        </p>
      </div>

      <div className="flex items-center gap-2 text-sm opacity-60">
        <Users size={14} />
        <span>{formatNumber(zone.beneficiaries)} people affected</span>
      </div>

      <p className="text-[13px] leading-relaxed opacity-50">{zone.description}</p>

      <div className="h-px bg-white/[0.08]" />

      {/* Donation amount selection */}
      <div className="space-y-3">
        <p className="text-[12px] text-white/50">Choose an amount (CAD)</p>

        <div className="grid grid-cols-2 gap-2">
          {QUICK_AMOUNTS.map(amt => (
            <button
              key={amt}
              onClick={() => { setSelectedAmount(amt); setCustomAmount(''); }}
              className={`py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedAmount === amt
                  ? 'bg-white/[0.14] text-white border border-white/25'
                  : 'bg-white/[0.04] text-white/60 border border-white/[0.08] hover:bg-white/[0.08]'
              }`}
            >
              ${amt}
            </button>
          ))}
        </div>

        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-sm">$</span>
          <input
            type="number"
            placeholder="Or enter custom amount"
            value={customAmount}
            onChange={e => {
              setCustomAmount(e.target.value);
              setSelectedAmount(null);
            }}
            className="w-full pl-7 pr-3 py-2.5 rounded-lg text-sm text-white placeholder:text-white/30 outline-none"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
            }}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2 mt-auto">
        <button
          onClick={() => amount > 0 && onDonate('zakat', amount)}
          disabled={amount <= 0}
          className="w-full h-11 rounded-lg font-medium text-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:brightness-110"
          style={{ backgroundColor: amount > 0 ? '#C9941A' : '#555', color: '#060810' }}
        >
          Give Zakat
        </button>
        <button
          onClick={() => amount > 0 && onDonate('sadaqah', amount)}
          disabled={amount <= 0}
          className="w-full h-11 rounded-lg font-medium text-sm border transition-colors disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/[0.06]"
          style={{ borderColor: amount > 0 ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.08)' }}
        >
          Give Sadaqah
        </button>
      </div>

      <p className="text-[11px] opacity-30 italic text-center">
        Your donation will be tracked from contribution → verified impact
      </p>
    </>
  );
}
