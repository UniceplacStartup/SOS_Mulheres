import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { useSos } from '../../context/SosContext';

export function RegisterScreen() {
  const { setMobileScreen } = useSos();

  return (
    <div className="flex-1 flex flex-col bg-white overflow-y-auto">
      <div className="bg-[#990012] pt-12 pb-5 px-5 rounded-b-[28px] text-white flex items-center gap-3 -mt-9 shadow-md">
        <button
          onClick={() => setMobileScreen('LOGIN')}
          className="p-1.5 hover:bg-white/10 rounded-lg transition"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-lg font-black">Criar conta segura</h2>
          <p className="text-[10px] text-red-100">Cadastro confidencial com senha de coação</p>
        </div>
      </div>

      <div className="p-5 space-y-3 flex-1 overflow-y-auto">
        <div>
          <label className="text-xs font-bold text-slate-700">Nome completo</label>
          <input
            type="text"
            defaultValue="Maria da Silva"
            placeholder="Seu nome completo"
            className="w-full bg-slate-100 rounded-xl px-3.5 py-2.5 text-sm mt-1 outline-none border border-slate-200 focus:border-[#990012]"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-700">CPF</label>
          <input
            type="text"
            defaultValue="412.889.100-22"
            placeholder="000.000.000-00"
            className="w-full bg-slate-100 rounded-xl px-3.5 py-2.5 text-sm mt-1 outline-none border border-slate-200 focus:border-[#990012]"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-700">E-mail</label>
          <input
            type="email"
            defaultValue="maria.silva@email.com"
            placeholder="seu@email.com"
            className="w-full bg-slate-100 rounded-xl px-3.5 py-2.5 text-sm mt-1 outline-none border border-slate-200 focus:border-[#990012]"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs font-bold text-slate-700">PIN Real</label>
            <input
              type="password"
              maxLength={4}
              defaultValue="1234"
              placeholder="1234"
              className="w-full bg-slate-100 rounded-xl px-3.5 py-2.5 text-sm mt-1 outline-none border border-slate-200 focus:border-emerald-600 font-mono text-center"
            />
            <span className="text-[10px] text-slate-400">Encerra o alarme</span>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-700">PIN Coação</label>
            <input
              type="password"
              maxLength={4}
              defaultValue="9999"
              placeholder="9999"
              className="w-full bg-slate-100 rounded-xl px-3.5 py-2.5 text-sm mt-1 outline-none border border-slate-200 focus:border-red-600 font-mono text-center"
            />
            <span className="text-[10px] text-red-500 font-medium">Alerta silencioso</span>
          </div>
        </div>
        <div>
          <label className="text-xs font-bold text-slate-700">Nº Medida Protetiva (opcional)</label>
          <input
            type="text"
            defaultValue="MP-2026-991"
            placeholder="Ex: MP-2026-XXXX"
            className="w-full bg-slate-100 rounded-xl px-3.5 py-2.5 text-sm mt-1 outline-none border border-slate-200 focus:border-[#990012]"
          />
        </div>

        <button
          onClick={() => setMobileScreen('HOME')}
          className="w-full bg-[#990012] hover:bg-[#7e000f] text-white font-black py-3.5 rounded-xl shadow-md mt-2 transition"
        >
          Finalizar Cadastro
        </button>

        <p className="text-[11px] text-center text-slate-400 pt-1">
          Ao continuar, você aceita os <span className="text-[#990012] underline font-bold">Termos de Uso</span> e{' '}
          <span className="text-[#990012] underline font-bold">Privacidade LGPD</span>.
        </p>
      </div>
    </div>
  );
}
