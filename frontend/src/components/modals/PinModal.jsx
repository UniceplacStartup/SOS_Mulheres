import React from 'react';
import { useSos } from '../../context/SosContext';

export function PinModal() {
  const {
    pinModalOpen,
    setPinModalOpen,
    pinInput,
    setPinInput,
    pinError,
    handleVerifyPin,
  } = useSos();

  if (!pinModalOpen) return null;

  return (
    <div className="absolute inset-0 bg-black/75 z-50 flex items-center justify-center p-5 animate-fadeIn">
      <form onSubmit={handleVerifyPin} className="bg-white rounded-3xl p-6 w-full shadow-2xl border border-slate-100">
        <h4 className="font-black text-sm text-slate-900 tracking-tight">Confirme sua Senha de Segurança</h4>
        <p className="text-[11px] text-slate-500 mt-1 leading-snug">
          Digite <strong className="text-emerald-700 font-bold">1234</strong> para encerrar normalmente ou{' '}
          <strong className="text-red-700 font-bold">9999</strong> (Código de Coação Silenciosa caso esteja sob ameaça).
        </p>

        <input
          type="password"
          maxLength={4}
          autoFocus
          value={pinInput}
          onChange={(e) => setPinInput(e.target.value)}
          placeholder="••••"
          className="w-full text-center text-3xl tracking-[0.5em] bg-slate-100 rounded-2xl py-3 mt-4 font-black outline-none border border-slate-200 focus:border-[#990012] focus:bg-white transition"
        />

        {pinError && <p className="text-[11px] text-red-600 mt-2 text-center font-bold">{pinError}</p>}

        <div className="flex gap-2.5 mt-5">
          <button
            type="button"
            onClick={() => setPinModalOpen(false)}
            className="flex-1 py-3 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="flex-1 py-3 text-xs font-black text-white bg-[#990012] hover:bg-[#7e000f] rounded-xl shadow-md transition active:scale-95"
          >
            Confirmar
          </button>
        </div>
      </form>
    </div>
  );
}
