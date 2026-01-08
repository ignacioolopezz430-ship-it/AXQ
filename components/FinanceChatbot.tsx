
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Bot, User, AlertCircle, Loader2, Headset } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface Message {
  role: 'user' | 'model';
  text: string;
}

const FinanceChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Bienvenido al Soporte de AXQ. ¿En qué puedo ayudarte con la plataforma o tus dudas financieras generales?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: [...messages.map(m => ({
            role: m.role,
            parts: [{ text: m.text }]
        })), { role: 'user', parts: [{ text: userMessage }] }],
        config: {
          systemInstruction: `Eres el Agente de Soporte al Cliente de AXQ. 
          Tu objetivo es ayudar a los usuarios con la navegación de la plataforma, planes de suscripción y conceptos financieros básicos.
          STRICT RULES:
          - Solo responde preguntas sobre trading, finanzas, economía y uso de AXQ.
          - Si te preguntan algo fuera de este contexto (comida, deportes, ocio), responde: "Lo siento, como soporte de AXQ solo puedo asistirte en temas de la plataforma, finanzas y trading."
          - Mantén un tono servicial, profesional y claro.
          - No des consejos de inversión específicos que garanticen ganancias.`,
          temperature: 0.7,
        },
      });

      const responseText = response.text || "Lo siento, no pude procesar tu solicitud de soporte.";
      setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "Error de conexión. Inténtalo de nuevo." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] font-sans">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-4 rounded-full shadow-2xl transition-all transform hover:scale-110 active:scale-95 flex items-center justify-center ${
          isOpen ? 'bg-red-500 text-white rotate-90' : 'bg-blue-600 text-white'
        }`}
      >
        {isOpen ? <X size={24} /> : <Headset size={24} />}
      </button>

      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[90vw] sm:w-[400px] h-[550px] bg-[#111112] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          <div className="p-4 bg-gradient-to-r from-blue-700 to-indigo-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot size={20} className="text-white" />
              <div>
                <h3 className="text-white font-bold text-sm">AXQ Soporte</h3>
                <p className="text-[10px] text-blue-100 uppercase tracking-widest font-bold">Atención al Cliente</p>
              </div>
            </div>
          </div>

          <div className="px-4 py-2 bg-blue-500/10 border-b border-white/5 flex items-center gap-2 text-[10px] text-blue-400 font-medium">
            <AlertCircle size={12} />
            Especialistas en trading y plataforma.
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    msg.role === 'user' ? 'bg-blue-600' : 'bg-white/5 border border-white/10'
                  }`}>
                    {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <div className={`p-3 rounded-2xl text-sm leading-relaxed ${
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
              <div className="flex justify-start animate-pulse">
                <div className="flex gap-3 items-center p-3 rounded-2xl bg-white/5 border border-white/10">
                  <Loader2 size={16} className="animate-spin text-blue-400" />
                  <span className="text-xs text-gray-400">Escribiendo...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="p-4 border-t border-white/5 bg-white/5">
            <div className="relative">
              <input
                type="text"
                placeholder="¿Cómo puedo ayudarte?"
                className="w-full bg-[#1c1c1e] border border-white/10 rounded-xl py-3 pl-4 pr-12 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-colors"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-2 top-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
              >
                <Send size={16} />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default FinanceChatbot;
