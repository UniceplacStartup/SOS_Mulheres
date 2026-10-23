import React, { useState } from 'react';
import { useSos } from '../../context/SosContext';

export function NewContactModal() {
  const { newContactModal, setNewContactModal, addContact } = useSos();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  if (!newContactModal) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    addContact(name.trim(), phone.trim());
    setName('');
    setPhone('');
  };

  return (
    <div className="absolute inset-0 bg-black/75 z-50 flex items-center justify-center p-5 animate-fadeIn">
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-5 w-full space-y-3.5 shadow-2xl border border-slate-100">
        <h4 className="font-black text-sm text-slate-900">Novo Contato de Confiança</h4>
        <p className="text-[11px] text-slate-500 leading-snug">
          Será acionado automaticamente por SMS georreferenciado e e-mail em caso de pânico.
        </p>

        <div>
          <label className="text-xs font-bold text-slate-700">Nome e Parentesco</label>
          <input
            type="text"
            required
            placeholder="Ex: Júlia (Prima)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-slate-100 rounded-xl px-3.5 py-2.5 text-xs outline-none border border-slate-200 focus:border-[#990012] mt-1"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700">Telefone com DDD</label>
          <input
            type="tel"
            required
            placeholder="(11) 99999-9999"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full bg-slate-100 rounded-xl px-3.5 py-2.5 text-xs outline-none border border-slate-200 focus:border-[#990012] mt-1"
          />
        </div>

        <div className="flex gap-2.5 pt-2">
          <button
            type="button"
            onClick={() => setNewContactModal(false)}
            className="flex-1 py-2.5 text-xs font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-xl transition"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="flex-1 py-2.5 text-xs font-black bg-[#990012] hover:bg-[#7e000f] text-white rounded-xl shadow-md transition active:scale-95"
          >
            Salvar Contato
          </button>
        </div>
      </form>
    </div>
  );
}
