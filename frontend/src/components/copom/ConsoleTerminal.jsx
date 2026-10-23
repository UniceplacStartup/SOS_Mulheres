import React from 'react';
import { Terminal } from 'lucide-react';
import { useSos } from '../../context/SosContext';

export function ConsoleTerminal() {
  const { notificationLogs } = useSos();

  return (
    <div className="mt-4 bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-inner">
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-xs font-black text-slate-300 flex items-center gap-1.5 uppercase tracking-wider">
          <Terminal className="w-3.5 h-3.5 text-emerald-400" /> Console Sandbox — Disparos SMS, Telegram e CAD 190
        </span>
        <span className="text-[10px] text-slate-500 font-mono">Zero custo (Pronto para Produção)</span>
      </div>

      <div className="max-h-32 overflow-y-auto space-y-1.5 font-mono text-[11px] pr-1">
        {notificationLogs.map((log) => (
          <div
            key={log.id}
            className="text-slate-300 bg-slate-900/90 border border-slate-800/80 px-3 py-1.5 rounded-lg flex items-center gap-2"
          >
            <span className="text-slate-500 text-[10px]">[{log.time}]</span>
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                log.channel === 'COAÇÃO CRÍTICA'
                  ? 'bg-red-600 text-white animate-pulse'
                  : 'bg-red-950 text-red-300'
              }`}
            >
              {log.channel}
            </span>
            <span className="text-sky-300 font-semibold shrink-0">{log.recipient}:</span>
            <span className="text-slate-200 truncate">{log.msg}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
