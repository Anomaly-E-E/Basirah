const items = [
  { label: 'Critical', color: '#CC2200' },
  { label: 'High', color: '#D44000' },
  { label: 'Medium', color: '#E8A020' },
  { label: 'Recovering', color: '#2E8B57' },
];

export default function BottomLegend() {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 glass-pill rounded-full px-5 py-2 flex items-center gap-4">
      {items.map(item => (
        <div key={item.label} className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
          <span className="text-xs opacity-60">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
