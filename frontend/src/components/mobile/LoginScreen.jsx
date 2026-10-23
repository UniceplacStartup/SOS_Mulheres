import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useSos } from '../../context/SosContext';

export function LoginScreen() {
  const { setMobileScreen } = useSos();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex-1 flex flex-col bg-white overflow-y-auto">
      {/* Topo Vermelho com Logomarca */}
      <div className="bg-gradient-to-b from-[#990012] to-[#75000e] pt-12 pb-9 px-6 rounded-b-[40px] text-center text-white shadow-lg -mt-9">
        <div className="mt-4 flex items-center justify-center font-black text-5xl tracking-tight">
          <span>S</span>
          <span className="inline-flex flex-col items-center mx-1">
            <span className="w-9 h-9 rounded-full border-[6px] border-white inline-block shadow-inner" />
            <span className="w-1.5 h-3.5 bg-white -mt-0.5" />
            <span className="w-4 h-1.5 bg-white -mt-2.5" />
          </span>
          <span>S</span>
        </div>
        <h2 className="text-xl font-black tracking-widest mt-2">SOS MULHERES</h2>
        <p className="text-xs text-red-100 font-medium">Proteção. Sempre.</p>
      </div>

      <div className="p-6 flex-1 flex flex-col justify-center">
        <h3 className="text-xl font-black text-slate-900 mb-1">Bem-vinda de volta</h3>
        <p className="text-xs text-slate-500 mb-5">Acesso rápido e protegido para sua segurança.</p>

        <label className="text-xs font-bold text-slate-700 mb-1">E-mail</label>
        <input
          type="email"
          defaultValue="maria.silva@email.com"
          placeholder="seu@email.com"
          className="w-full bg-slate-100 rounded-xl px-4 py-3 text-sm mb-4 outline-none border border-slate-200 focus:border-[#990012] focus:bg-white transition"
        />

        <label className="text-xs font-bold text-slate-700 mb-1">Senha</label>
        <div className="relative mb-2">
          <input
            type={showPassword ? 'text' : 'password'}
            defaultValue="12345678"
            className="w-full bg-slate-100 rounded-xl px-4 py-3 text-sm outline-none border border-slate-200 focus:border-[#990012] focus:bg-white transition pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="p-1 absolute right-3 top-3 text-slate-400 hover:text-slate-600"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        <div className="text-right mb-5">
          <button type="button" className="text-xs text-[#990012] font-bold hover:underline">
            Esqueceu a senha?
          </button>
        </div>

        <button
          onClick={() => setMobileScreen('HOME')}
          className="w-full bg-[#990012] hover:bg-[#7e000f] active:scale-[0.98] text-white font-black py-3.5 rounded-xl shadow-lg shadow-red-950/20 transition-all text-sm"
        >
          Entrar
        </button>

        <div className="flex items-center gap-3 my-4">
          <div className="h-px bg-slate-200 flex-1" />
          <span className="text-xs text-slate-400 font-medium">ou</span>
          <div className="h-px bg-slate-200 flex-1" />
        </div>

        <button
          onClick={() => setMobileScreen('REGISTER')}
          className="w-full border-2 border-[#990012] text-[#990012] font-black py-3 rounded-xl text-sm hover:bg-red-50 transition"
        >
          Criar nova conta
        </button>
      </div>
    </div>
  );
}
