import React from 'react';
import { Navigation, Mic, ExternalLink } from 'lucide-react';
import { useSos } from '../../context/SosContext';

export function TacticalRadarMap() {
  const { currentCoords, sosActive, underDuress } = useSos();

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden min-h-[300px] shadow-inner">
      {/* Topo do Radar */}
      <div className="flex items-center justify-between z-10">
        <span className="bg-slate-900/90 border border-slate-700 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
          <Navigation className="w-3.5 h-3.5 text-red-500" /> Radar Tático COPOM (Viaturas 190)
        </span>
        <a
          href={`https://www.google.com/maps?q=${currentCoords.lat},${currentCoords.lng}`}
          target="_blank"
          rel="noreferrer"
          className="text-[11px] bg-sky-950/80 hover:bg-sky-900 text-sky-300 border border-sky-800 px-3 py-1.5 rounded-xl flex items-center gap-1 transition"
        >
          <span>Abrir Maps</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Grid de Radar Tático Animado */}
      <div className="my-auto flex flex-col items-center justify-center py-6 relative">
        <div className="w-48 h-48 rounded-full border border-emerald-500/20 flex items-center justify-center relative">
          <div className="w-32 h-32 rounded-full border border-emerald-500/30 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full border border-emerald-500/50 flex items-center justify-center">
              <div
                className={`w-5 h-5 rounded-full transition-all ${
                  sosActive || underDuress
                    ? 'bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.8)] animate-ping'
                    : 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]'
                }`}
              />
            </div>
          </div>
        </div>

        <p className="text-xs font-mono text-emerald-400 mt-4 bg-emerald-950/60 border border-emerald-800/60 px-3 py-1 rounded-lg">
          LAT: {currentCoords.lat} · LNG: {currentCoords.lng} (Precisão: {currentCoords.accuracy}m)
        </p>
      </div>

      {/* Caixa-Preta de Áudio com Integridade Forense */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-2.5 flex items-center justify-between text-xs z-10 shadow-sm">
        <span className="flex items-center gap-1.5 text-slate-300 font-semibold">
          <Mic className="w-4 h-4 text-red-400 animate-pulse" /> Caixa-Preta de Áudio (SHA-256)
        </span>
        <span className="text-[11px] font-mono text-emerald-400 font-bold">
          Evidência Jurídica Art. 158-A CPP
        </span>
      </div>
    </div>
  );
}
