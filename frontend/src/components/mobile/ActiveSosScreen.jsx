import React from 'react';
import { ChevronLeft, CheckCircle2, MapPin } from 'lucide-react';
import { useSos } from '../../context/SosContext';

export function ActiveSosScreen() {
  const {
    setMobileScreen,
    sosSeconds,
    isOnline,
    currentCoords,
    nextUpdateCountdown,
    setPinModalOpen,
  } = useSos();

  const formatTimer = (totalSec) => {
    const m = String(Math.floor(totalSec / 60)).padStart(2, '0');
    const s = String(totalSec % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="flex-1 flex flex-col bg-white px-5 pt-3 pb-3 overflow-y-auto">
      <div className="flex items-center gap-2">
        <button
          onClick={() => setMobileScreen('HOME')}
          className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-700 transition"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="font-extrabold text-sm text-slate-900">Alerta de Emergência Ativo</span>
      </div>

      {/* Botão SOS com Cronômetro Central */}
      <div className="flex justify-center my-3">
        <div className="w-36 h-36 rounded-full bg-gradient-to-b from-[#b80016] to-[#7a000e] text-white flex flex-col items-center justify-center shadow-[0_0_40px_rgba(153,0,18,0.5)] animate-pulse">
          <span className="font-black text-3xl tracking-wider">SOS</span>
          <span className="font-mono text-sm mt-1 text-red-100 font-bold">{formatTimer(sosSeconds)}</span>
        </div>
      </div>

      {/* Badges de Confirmação em Tempo Real */}
      <div className="space-y-2">
        <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-3.5 py-2 flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="text-xs font-bold text-emerald-900">
            {isOnline ? 'Alerta despachado à Central COPOM 190' : 'Alerta salvo na fila Offline do dispositivo'}
          </span>
        </div>
        <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-3.5 py-2 flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="text-xs font-bold text-emerald-900">Rastreamento Geoespacial Contínuo Ativo</span>
        </div>
        <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-3.5 py-2 flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="text-xs font-bold text-emerald-900">Contatos de emergência avisados</span>
        </div>
      </div>

      {/* Card de Localização Atual */}
      <div className="mt-3 border border-slate-200 rounded-2xl p-3.5 shadow-sm bg-slate-50/50">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
          <MapPin className="w-3.5 h-3.5 text-[#990012]" /> Localização GPS Atual
        </div>
        <p className="text-xs text-slate-700 font-mono mt-1 font-semibold">
          Lat: {currentCoords.lat} · Long: {currentCoords.lng}
        </p>
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/80">
          <span className="text-[11px] text-slate-500 font-medium">
            Próximo ciclo de atualização em <strong className="text-slate-800 font-mono">{nextUpdateCountdown}s</strong>
          </span>
          <div className="flex items-end gap-1 h-3.5">
            <span className="w-1 h-2 bg-emerald-500 rounded-sm" />
            <span className="w-1 h-2.5 bg-emerald-500 rounded-sm" />
            <span className="w-1 h-3.5 bg-emerald-500 rounded-sm" />
            <span className={`w-1 h-3.5 rounded-sm ${isOnline ? 'bg-emerald-500' : 'bg-slate-300'}`} />
          </div>
        </div>
      </div>

      <button
        onClick={() => setPinModalOpen(true)}
        className="mt-auto w-full border-2 border-[#990012] hover:bg-red-50 text-[#990012] font-black py-3 rounded-xl text-xs transition shadow-sm"
      >
        Encerrar ocorrência
      </button>
    </div>
  );
}
