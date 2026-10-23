import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { SosApi } from '../services/api';
import { OfflineGeoQueue } from '../services/offlineQueue';

const SosContext = createContext(null);

export function SosProvider({ children }) {
  // Modos de Visualização
  const [viewMode, setViewMode] = useState('SPLIT'); // 'MOBILE' | 'COPOM' | 'SPLIT'
  const [mobileScreen, setMobileScreen] = useState('LOGIN'); // 'LOGIN' | 'REGISTER' | 'HOME' | 'ACTIVE_SOS' | 'TIPS' | 'CONTACTS'

  // Simulação de Rede e Conectividade
  const [isOnline, setIsOnline] = useState(true);
  const [offlineQueue, setOfflineQueue] = useState(OfflineGeoQueue.getQueue());
  const [syncedHistory, setSyncedHistory] = useState([
    { id: 'loc-1', lat: -23.55052, lng: -46.633308, time: '14:20:05', status: 'ONLINE', accuracy: '8m' },
  ]);

  // Estado do Alarme SOS
  const [sosActive, setSosActive] = useState(false);
  const [underDuress, setUnderDuress] = useState(false);
  const [sosSeconds, setSosSeconds] = useState(0);
  const [nextUpdateCountdown, setNextUpdateCountdown] = useState(10);
  const [activeIncidentId, setActiveIncidentId] = useState('inc-default-8841');
  const [protocolCode, setProtocolCode] = useState('COPOM-2026-8841');

  // Coordenadas GPS (Inicia no centro de SP, ou busca do navegador)
  const [currentCoords, setCurrentCoords] = useState({ lat: -23.5505, lng: -46.6333, accuracy: 8 });

  // Modais de Segurança e Camuflagem
  const [camouflageMode, setCamouflageMode] = useState(false);
  const [calcInput, setCalcInput] = useState('');
  const [fakeCallModal, setFakeCallModal] = useState(false);
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [newContactModal, setNewContactModal] = useState(false);

  // Contatos de Confiança
  const [contacts, setContacts] = useState([
    { id: 1, name: 'Ana (Irmã)', phone: '(11) 98765-4321' },
    { id: 2, name: 'Delegacia 5ª DP', phone: '(11) 3333-4444' },
  ]);

  // Terminal de Notificações / Disparos Multicanal
  const [notificationLogs, setNotificationLogs] = useState([
    {
      id: 'init-1',
      time: 'Sistema Pronto',
      channel: 'SISTEMA',
      recipient: 'Central 190 & Gateways',
      msg: 'Ambiente Corporativo Inicializado. Pronto para testes de pânico e queda de rede.',
    },
  ]);

  // Histórico de Conversas do Chatbot de Triagem
  const [chatHistory, setChatHistory] = useState([
    { sender: 'BOT', text: 'Orientação rápida de emergência. Toque em uma opção abaixo para instruções imediatas:' },
  ]);

  // Registra logs no terminal Sandbox
  const addNotificationLog = useCallback((channel, recipient, msg) => {
    const time = new Date().toLocaleTimeString('pt-BR');
    setNotificationLogs((prev) => [
      { id: `${Date.now()}-${Math.random().toString(36).substring(2, 6)}`, time, channel, recipient, msg },
      ...prev.slice(0, 14),
    ]);
  }, []);

  // Leitura do GPS real do navegador no carregamento inicial
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCurrentCoords({
            lat: Number(pos.coords.latitude.toFixed(5)),
            lng: Number(pos.coords.longitude.toFixed(5)),
            accuracy: Math.round(pos.coords.accuracy || 8),
          });
        },
        () => {
          // Mantém valor padrão elegante
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    }
  }, []);

  // Loop de Telemetria Contínua quando SOS está ativo
  useEffect(() => {
    if (!sosActive && !underDuress) return;

    const timer = setInterval(() => {
      setSosSeconds((prev) => prev + 1);

      setNextUpdateCountdown((prev) => {
        if (prev <= 1) {
          // Simula pequena variação de deslocamento a pé (0.0003 graus ~= 30 metros)
          const newLat = Number((currentCoords.lat + (Math.random() - 0.48) * 0.0004).toFixed(5));
          const newLng = Number((currentCoords.lng + (Math.random() - 0.48) * 0.0004).toFixed(5));
          const timestamp = new Date().toLocaleTimeString('pt-BR');

          setCurrentCoords({ lat: newLat, lng: newLng, accuracy: Math.floor(Math.random() * 5) + 6 });

          const packet = {
            id: `pt-${Date.now()}`,
            lat: newLat,
            lng: newLng,
            time: timestamp,
            status: isOnline ? 'ONLINE' : 'OFFLINE_SYNCED',
            accuracy: '6m',
          };

          if (isOnline) {
            setSyncedHistory((old) => [packet, ...old]);
            SosApi.streamLocation(activeIncidentId, {
              latitude: newLat,
              longitude: newLng,
              accuracyMeters: 6,
              capturedOffline: false,
            });
          } else {
            OfflineGeoQueue.saveCoordinateOffline({
              latitude: newLat,
              longitude: newLng,
              accuracyMeters: 8,
              capturedAt: new Date().toISOString(),
            });
            setOfflineQueue(OfflineGeoQueue.getQueue());
          }

          return 10;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [sosActive, underDuress, isOnline, currentCoords, activeIncidentId]);

  // Sincronização Automática (Background Sync) ao restabelecer a Conexão
  useEffect(() => {
    if (isOnline && offlineQueue.length > 0) {
      const pendingPoints = [...offlineQueue];
      const count = pendingPoints.length;

      // Persiste no PostGIS via backend
      SosApi.syncOfflineBatch(activeIncidentId, pendingPoints).finally(() => {
        const converted = pendingPoints.map((pt, i) => ({
          id: `sync-${Date.now()}-${i}`,
          lat: pt.latitude || pt.lat,
          lng: pt.longitude || pt.lng,
          time: new Date(pt.capturedAt || Date.now()).toLocaleTimeString('pt-BR'),
          status: 'OFFLINE_SYNCED',
          accuracy: `${pt.accuracyMeters || 8}m`,
        }));

        setSyncedHistory((prev) => [...converted.reverse(), ...prev]);
        OfflineGeoQueue.clearQueue();
        setOfflineQueue([]);

        addNotificationLog(
          'POSTGIS SYNC',
          'Servidor Neon DB & COPOM 190',
          `Conexão restabelecida! ${count} coordenadas gravadas no cache offline foram sincronizadas no mapa tático.`
        );
      });
    }
  }, [isOnline, offlineQueue, activeIncidentId, addNotificationLog]);

  // Ação de Disparo SOS
  const triggerSOS = useCallback(async () => {
    setSosActive(true);
    setUnderDuress(false);
    setSosSeconds(1);
    setNextUpdateCountdown(10);
    setMobileScreen('ACTIVE_SOS');

    const mapsUrl = `https://maps.google.com/?q=${currentCoords.lat},${currentCoords.lng}`;

    if (isOnline) {
      const result = await SosApi.triggerSos({
        latitude: currentCoords.lat,
        longitude: currentCoords.lng,
        accuracyMeters: currentCoords.accuracy,
        triggeredOffline: false,
      });

      if (result?.data?.id) {
        setActiveIncidentId(result.data.id);
        if (result.data.protocolCode) setProtocolCode(result.data.protocolCode);
      }

      addNotificationLog(
        'WEBHOOK 190',
        'Central COPOM / CAD',
        `Protocolo #${result?.data?.protocolCode || protocolCode} aberto. Rastreamento GPS ativo em (${currentCoords.lat}, ${currentCoords.lng}).`
      );

      contacts.forEach((c) => {
        addNotificationLog(
          'SMS / TELEGRAM',
          `${c.name} - ${c.phone}`,
          `EMERGÊNCIA: Maria da Silva acionou o SOS Mulheres. Localização: ${mapsUrl}`
        );
      });
    } else {
      OfflineGeoQueue.saveCoordinateOffline({
        latitude: currentCoords.lat,
        longitude: currentCoords.lng,
        accuracyMeters: currentCoords.accuracy,
        capturedAt: new Date().toISOString(),
      });
      setOfflineQueue(OfflineGeoQueue.getQueue());
      addNotificationLog(
        'INDEXED_DB (OFFLINE)',
        'Cache Local do Dispositivo',
        `Sem sinal de internet! Alerta e coordenada (${currentCoords.lat}, ${currentCoords.lng}) salvos na fila local para sincronização posterior.`
      );
    }
  }, [currentCoords, isOnline, protocolCode, contacts, addNotificationLog]);

  // Ação de Encerramento com Senha (1234 Real vs 9999 Coação)
  const handleVerifyPin = useCallback(
    async (e) => {
      e?.preventDefault();
      try {
        const res = await SosApi.terminateIncident(activeIncidentId, pinInput);

        if (pinInput === '1234' || res?.data?.uiAction === 'REAL_SHUTDOWN') {
          setSosActive(false);
          setUnderDuress(false);
          setPinModalOpen(false);
          setPinInput('');
          setPinError('');
          setMobileScreen('HOME');
          addNotificationLog('SISTEMA', 'Central 190', 'Ocorrência encerrada com PIN autêntico (1234).');
        } else if (pinInput === '9999' || res?.data?.uiAction === 'FAKE_SHUTDOWN') {
          // Falso Desligamento na tela da usuária para despistar o agressor
          setSosActive(false);
          setUnderDuress(true); // COPOM continua monitorando em alerta vermelho!
          setPinModalOpen(false);
          setPinInput('');
          setPinError('');
          setMobileScreen('HOME');

          addNotificationLog(
            'COAÇÃO CRÍTICA',
            'COPOM 190 (PRIORIDADE MÁXIMA)',
            'ALERTA SILENCIOSO: Vítima inseriu Código de Coação (9999). O app fingiu desligar na tela, mas o rastreamento e áudio seguem ativos!'
          );
        } else {
          setPinError('PIN incorreto. Para teste use 1234 (Real) ou 9999 (Coação).');
        }
      } catch (err) {
        setPinError(err.message || 'PIN incorreto. Use 1234 ou 9999.');
      }
    },
    [activeIncidentId, pinInput, addNotificationLog]
  );

  // Ação da Calculadora Camuflada
  const handleCalcButton = useCallback(
    (val) => {
      if (val === 'C') {
        setCalcInput('');
        return;
      }
      const nextVal = calcInput + val;
      // Código secreto de saída da camuflagem: 911=
      if (nextVal.endsWith('911=')) {
        setCamouflageMode(false);
        setCalcInput('');
        return;
      }
      if (val === '=') {
        try {
          // eslint-disable-next-line no-eval
          const sanitized = calcInput.replace(/[^-+*/0-9.]/g, '');
          // eslint-disable-next-line no-new-func
          const result = Function(`'use strict'; return (${sanitized})`)();
          setCalcInput(String(result));
        } catch {
          setCalcInput('Erro');
        }
        return;
      }
      setCalcInput(nextVal);
    },
    [calcInput]
  );

  // Chatbot Rápido
  const handleQuickChat = useCallback((question) => {
    let reply = '';
    if (question === 'Estou sendo seguida') {
      reply =
        'Entre imediatamente em um comércio movimentado ou local iluminado. Não vá para casa se estiver sozinha. Pressione o botão SOS abaixo para enviar seu GPS à polícia.';
    } else if (question === 'Violência em casa agora') {
      reply =
        'Afaste-se de locais com objetos cortantes (como cozinha) e procure um cômodo com saída ou tranca. Acione o SOS e use o Modo Calculadora (ícone no topo) para esconder o aplicativo.';
    } else if (question === 'Código de Coação') {
      reply =
        'Se o agressor obrigar você a desligar o alarme, digite a senha 9999. O aplicativo fingirá que desligou, mas a polícia receberá alerta vermelho de coação.';
    } else {
      reply =
        'A Delegacia da Mulher mais próxima no seu raio GPS é a 5ª DP (a 1.4 km). Acione o SOS para despacho imediato de viatura.';
    }
    setChatHistory((prev) => [...prev, { sender: 'USER', text: question }, { sender: 'BOT', text: reply }]);
  }, []);

  const addContact = useCallback(
    (name, phone) => {
      if (!name || !phone || contacts.length >= 5) return;
      setContacts((prev) => [...prev, { id: Date.now(), name, phone }]);
      setNewContactModal(false);
    },
    [contacts.length]
  );

  const removeContact = useCallback((id) => {
    setContacts((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const value = {
    viewMode,
    setViewMode,
    mobileScreen,
    setMobileScreen,
    isOnline,
    setIsOnline,
    offlineQueue,
    syncedHistory,
    sosActive,
    underDuress,
    sosSeconds,
    nextUpdateCountdown,
    activeIncidentId,
    protocolCode,
    currentCoords,
    camouflageMode,
    setCamouflageMode,
    calcInput,
    fakeCallModal,
    setFakeCallModal,
    pinModalOpen,
    setPinModalOpen,
    pinInput,
    setPinInput,
    pinError,
    setPinError,
    chatbotOpen,
    setChatbotOpen,
    newContactModal,
    setNewContactModal,
    contacts,
    notificationLogs,
    chatHistory,
    triggerSOS,
    handleVerifyPin,
    handleCalcButton,
    handleQuickChat,
    addContact,
    removeContact,
    addNotificationLog,
  };

  return <SosContext.Provider value={value}>{children}</SosContext.Provider>;
}

export function useSos() {
  const context = useContext(SosContext);
  if (!context) {
    throw new Error('useSos deve ser utilizado dentro de um SosProvider');
  }
  return context;
}
