
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
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

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
          systemInstruction: `Eres el Agente de Soporte al Cliente de AXQ. 
          Tu objetivo es ayudar a los usuarios con la navegación de la plataforma, planes de suscripción y conceptos financieros básicos.
          STRICT RULES:
          - Solo responde preguntas sobre trading, finanzas, economía y uso de AXQ.
          - Si te preguntan algo fuera de este contexto, responde educadamente que solo puedes asistir en temas de AXQ.
          - No des consejos de inversión específicos.`,
          temperature: 0.7,
        },
      });

      const responseText = response.text || "Lo siento, no pude procesar tu solicitud.";
      setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "Error de conexión. Verifica la configuración de la plataforma." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-4 rounded-full shadow-2xl transition-all flex items-center justify-center ${
          isOpen ? 'bg-red-500 text-white' : 'bg-blue-600 text-white'
        }`}
      >
        {isOpen ? <X size={24} /> : <Headset size={24} />}
      </button>

      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[90vw] sm:w-[400px] h-[550px] bg-[#111112] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-slide-up">
          <div className="p-4 bg-gradient-to-r from-blue-700 to-indigo-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot size={20} className="text-white" />
              <div>
                <h3 className="text-white font-bold text-sm">AXQ Soporte</h3>
                <p className="text-[10px] text-blue-100 uppercase tracking-widest font-bold">Atención al Cliente</p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`p-3 rounded-2xl text-sm ${
                    msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white/5 border border-white/10 text-gray-200'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <Loader2 size={16} className="animate-spin text-blue-400" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="p-4 border-t border-white/5">
            <input
              type="text"
              placeholder="Escribe tu duda..."
              className="w-full bg-[#1c1c1e] border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </form>
        </div>
      )}
    </div>
  );
};

export default FinanceChatbot;
