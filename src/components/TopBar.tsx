import React from "react";

interface TopBarProps {
  totalZones: number;
  fundingGap: number;
  onMenuToggle: () => void;

  user?: { email?: string } | null;
  onLogout?: () => void;
}

export default function TopBar({
  totalZones,
  fundingGap,
  onMenuToggle,
  user,
  onLogout,
}: TopBarProps) {
  return (
    <div className="w-full h-14 px-4 flex items-center justify-between bg-black/40 backdrop-blur-md border-b border-white/10">
      
      {/* LEFT SIDE */}
      <div className="flex items-center gap-4">
        <button onClick={onMenuToggle} className="text-white">
          ☰
        </button>

        <span className="text-white text-sm">
          Zones: {totalZones}
        </span>

        <span className="text-white text-sm">
          Gap: ${fundingGap.toLocaleString()}
        </span>
      </div>

      {/* RIGHT SIDE (USER) */}
      <div className="flex items-center gap-3">
        {user && (
          <>
            <span className="text-sm text-gray-300">
              {user.email}
            </span>

            <button
              onClick={onLogout}
              className="px-3 py-1 rounded-md bg-red-500/10 text-red-400 hover:bg-red-500/20 transition"
            >
              Sign out
            </button>
          </>
        )}
      </div>
    </div>
  );
}