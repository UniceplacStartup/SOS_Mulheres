import React from 'react';
import { ChevronLeft, User, Trash2, Plus, AlertTriangle } from 'lucide-react';
import { useSos } from '../../context/SosContext';

export function ContactsScreen() {
  const { setMobileScreen, contacts, removeContact, setNewContactModal } = useSos();

  return (
    <div className="flex-1 flex flex-col bg-white overflow-y-auto">
      <div className="bg-[#990012] pt-11 pb-4 px-5 rounded-b-[28px] text-white -mt-9 shadow-md">
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() => setMobileScreen('HOME')}
            className="p-1 hover:bg-white/10 rounded-lg transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-base font-black">Contatos de Confiança</h2>
            <p className="text-[11px] text-red-100 font-medium">{contacts.length}/5 contatos cadastrados</p>
          </div>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div className="space-y-2.5">
          {contacts.map((c) => (
            <div
              key={c.id}
              className="bg-slate-50 border border-slate-100 rounded-2xl p-3 flex items-center justify-between shadow-xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-red-100 text-[#990012] flex items-center justify-center font-bold">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{c.name}</h4>
                  <p className="text-[11px] text-slate-500 font-mono">{c.phone}</p>
                </div>
              </div>
              <button
                onClick={() => removeContact(c.id)}
                className="text-slate-400 hover:text-red-600 p-1.5 transition"
                title="Excluir contato"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}

          {contacts.length < 5 && (
            <button
              onClick={() => setNewContactModal(true)}
              className="w-full border-2 border-dashed border-[#990012] text-[#990012] rounded-2xl py-3 text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-red-50 transition"
            >
              <Plus className="w-4 h-4" /> Adicionar contato de confiança
            </button>
          )}
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2.5 mt-4">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-[11px] text-amber-900 leading-snug">
            Seus contatos receberão link georreferenciado e aviso prioritário no momento do acionamento do SOS.
          </p>
        </div>
      </div>
    </div>
  );
}
