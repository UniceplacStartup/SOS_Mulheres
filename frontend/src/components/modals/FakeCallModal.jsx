import React from 'react';
import { Volume2, PhoneOff } from 'lucide-react';
import { useSos } from '../../context/SosContext';

export function FakeCallModal() {
  const { fakeCallModal, setFakeCallModal } = useSos();

  if (!fakeCallModal) return null;

  return (
    <div className="absolute inset-0 bg-slate-950 text-white z-50 flex flex-col justify-between p-6 text-center animate-fadeIn">
      <div className="mt-8">
        <p className="text-xs text-emerald-400 font-bold uppercase tracking-widest animate-pulse">
          Chamada de Voz Recebida...
        </p>
        <h3 className="text-3xl font-black mt-2 tracking-tight">Pai (Chegando)</h3>
        <p className="text-xs text-slate-400 mt-1 font-mono">(11) 99812-0011</p>
      </div>

      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 text-xs text-left text-slate-200 space-y-2.5 shadow-2xl">
        <div className="flex items-center gap-2 text-emerald-400 font-bold">
          <Volume2 className="w-4 h-4 animate-bounce" /> Áudio dissuasivo em reprodução:
        </div>
        <p className="italic text-slate-300 leading-relaxed text-[13px]">
          "Oi filha! Já estou aqui na esquina te vendo, pode vir andando em direção ao carro que já abri a porta pra você!"
        </p>
      </div>

      <button
        onClick={() => setFakeCallModal(false)}
        className="w-full bg-red-600 hover:bg-red-700 active:scale-95 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-lg transition"
      >
        <PhoneOff className="w-4 h-4" /> Desligar Chamada Simulada
      </button>
    </div>
  );
}
