
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Loader2, ShieldCheck, BrainCircuit } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface TradingAssistantProps {
  assetSymbol: string;
}

const TradingAssistant: React.FC<TradingAssistantProps> = ({ assetSymbol }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: `Analista Pro de AXQ listo. Estoy monitoreando ${assetSymbol}. ¿Necesitas una estrategia detallada o análisis de indicadores para hoy?` }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: [...messages.map(m => ({
            role: m.role,
            parts: [{ text: m.text }]
        })), { role: 'user', parts: [{ text: userMessage }] }],
        config: {
          systemInstruction: `Eres el Analista de Estrategia Profesional de AXQ.
          Tu misión es proveer análisis técnico profundo, sugerencias de gestión de riesgo y explicaciones de mercado.
          REGLAS DE ORO:
          - Eres un experto en Force Index, RSI, MACD y Acción del Precio.
          - Solo hablas de trading, inversiones, dinero y mercados financieros.
          - Si el usuario sale del tema (ej. clima, películas), advierte: "⚠️ Error de Contexto: Mi procesamiento está limitado estrictamente a Mercados Financieros y Trading Profesional."
          - Sé técnico, directo y utiliza terminología de la industria.
          - Menciona que el activo actual es ${assetSymbol} si es relevante.`,
          temperature: 0.8,
        },
      });

      const responseText = response.text || "No se pudo generar el análisis en este momento.";
      setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    } catch (error) {
      console.error("Trading AI error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "Falla en el motor de análisis. Reintenta." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#111112] border border-white/10 rounded-2xl flex flex-col h-[500px] shadow-2xl overflow-hidden animate-fade">
      <div className="p-4 bg-white/[0.03] border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center text-blue-400">
            <BrainCircuit size={24} />
          </div>
          <div>
            <h3 className="font-bold text-white flex items-center gap-2">
              Asistente Pro Estratégico
              <Sparkles size={14} className="text-yellow-400 fill-yellow-400" />
            </h3>
            <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">IA de Alto Rendimiento</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 rounded-full text-[10px] text-green-400 font-bold border border-green-500/20">
          <ShieldCheck size={12} /> VERIFICADO
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar bg-gradient-to-b from-transparent to-black/20">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-4 max-w-[90%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border transition-all ${
                msg.role === 'user' ? 'bg-blue-600 border-blue-500 shadow-lg shadow-blue-500/20' : 'bg-white/5 border-white/10'
              }`}>
                {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
              </div>
              <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none' 
                : 'bg-white/5 border border-white/10 text-gray-200 rounded-tl-none'
              }`}>
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex gap-4 items-center p-4 rounded-2xl bg-white/5 border border-white/10">
              <Loader2 size={18} className="animate-spin text-blue-400" />
              <span className="text-xs text-gray-400 font-medium italic">Calculando probabilidades y estrategia...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="p-4 bg-white/[0.02] border-t border-white/5">
        <div className="relative group">
          <input
            type="text"
            placeholder="Ej: ¿Qué estrategia de scalping recomiendas para este RSI?"
            className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-5 pr-14 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition-all focus:ring-1 focus:ring-blue-500/20"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2.5 top-2.5 p-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-all disabled:opacity-30 disabled:grayscale shadow-lg shadow-blue-500/20"
          >
            <Send size={18} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default TradingAssistant;
