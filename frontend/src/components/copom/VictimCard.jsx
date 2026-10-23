import React from 'react';
import { ShieldCheck, Database } from 'lucide-react';
import { useSos } from '../../context/SosContext';

export function VictimCard() {
  const { currentCoords, offlineQueue, protocolCode } = useSos();

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-inner">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Dados da Vítima Protegida
        </span>
        <span className="text-[11px] font-mono text-red-400 font-bold bg-red-950/80 px-2 py-0.5 rounded-md border border-red-800/80">
          Medida Protetiva #MP-2026-991
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2.5 text-xs">
        <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-xl">
          <span className="text-slate-500 block text-[10px] uppercase font-bold">Nome Completo</span>
          <strong className="text-white font-bold">Maria da Silva</strong>
        </div>
        <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-xl">
          <span className="text-slate-500 block text-[10px] uppercase font-bold">CPF</span>
          <strong className="text-white font-mono">412.889.100-22</strong>
        </div>
        <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-xl">
          <span className="text-slate-500 block text-[10px] uppercase font-bold">Protocolo Ativo</span>
          <strong className="text-sky-400 font-mono font-bold">{protocolCode}</strong>
        </div>
        <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-xl">
          <span className="text-slate-500 block text-[10px] uppercase font-bold">Fila Offline no Celular</span>
          <strong className={`font-mono ${offlineQueue.length > 0 ? 'text-amber-400 animate-pulse' : 'text-slate-400'}`}>
            {offlineQueue.length} pacotes retidos
          </strong>
        </div>
      </div>
    </div>
  );
}
