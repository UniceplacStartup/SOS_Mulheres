import React from 'react';
import { Radio, ShieldAlert } from 'lucide-react';
import { useSos } from '../../context/SosContext';
import { VictimCard } from './VictimCard';
import { TelemetryTrail } from './TelemetryTrail';
import { TacticalRadarMap } from './TacticalRadarMap';
import { ConsoleTerminal } from './ConsoleTerminal';

export function CopomPanel() {
  const { underDuress, sosActive, protocolCode } = useSos();

  return (
    <div className="flex-1 bg-slate-900 border border-slate-800 rounded-3xl p-5 flex flex-col justify-between shadow-2xl overflow-hidden">
      <div>
        {/* Cabeçalho Policial Integrado */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-red-950/80 border border-red-800 text-red-400 shadow-inner">
              <Radio className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-black text-base text-white tracking-wide">
                  CENTRAL INTEGRADA 190 / COPOM — MONITORAMENTO TÁTICO
                </h2>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono font-bold">
                  WEBHOOK CAD ATIVO
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Telemetria PostGIS em tempo real, Caixa-Preta Forense e salvaguarda contra coação silenciosa
              </p>
            </div>
          </div>

          {/* Badge de Status de Prioridade Policial */}
          <div
            className={`px-4 py-2 rounded-xl border text-xs font-black flex items-center gap-2 shadow-lg transition-all ${
              underDuress
                ? 'bg-red-600 text-white border-white animate-bounce'
                : sosActive
                ? 'bg-red-950/90 border-red-600 text-red-200'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
          >
            <ShieldAlert className="w-4 h-4 shrink-0" />
            {underDuress
              ? 'ALERTA CRÍTICO: VÍTIMA SOB COAÇÃO FORÇADA (PIN 9999)'
              : sosActive
              ? `OCORRÊNCIA #${protocolCode} EM ANDAMENTO`
              : 'AGUARDANDO ACIONAMENTO'}
          </div>
        </div>

        {/* Grid Principal: Ficha da Vítima + Trilha Geoespacial + Radar Tático */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mt-4">
          <div className="space-y-4">
            <VictimCard />
            <TelemetryTrail />
          </div>
          <div>
            <TacticalRadarMap />
          </div>
        </div>
      </div>

      {/* Terminal de Disparos Multicanal */}
      <ConsoleTerminal />
    </div>
  );
}
