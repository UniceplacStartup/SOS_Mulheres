import React from 'react';
import { Database } from 'lucide-react';
import { useSos } from '../../context/SosContext';

export function TelemetryTrail() {
  const { syncedHistory } = useSos();

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-inner">
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-xs font-black text-slate-300 flex items-center gap-1.5 uppercase tracking-wider">
          <Database className="w-3.5 h-3.5 text-sky-400" /> Trilha Geoespacial (Neon PostGIS)
        </span>
        <span className="text-[11px] text-slate-500 font-mono">{syncedHistory.length} pontos gravados</span>
      </div>

      <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1">
        {syncedHistory.map((pt) => (
          <div
            key={pt.id}
            className="text-[11px] bg-slate-900/90 border border-slate-800/80 rounded-xl px-3 py-1.5 flex items-center justify-between font-mono"
          >
            <span className="text-slate-300">
              POINT({pt.lat} {pt.lng})
            </span>
            <span className="text-slate-400 text-[10px]">{pt.time}</span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                pt.status === 'OFFLINE_SYNCED'
                  ? 'bg-amber-950/80 text-amber-300 border border-amber-700/80'
                  : 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/80'
              }`}
            >
              {pt.status === 'OFFLINE_SYNCED' ? 'SYNC OFFLINE' : 'TEMPO REAL'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
