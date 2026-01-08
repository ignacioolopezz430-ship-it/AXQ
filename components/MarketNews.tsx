
import React, { useState, useEffect } from 'react';
import { Search, ExternalLink, Clock, Newspaper, TrendingUp, RefreshCw, AlertCircle } from 'lucide-react';
import { getMarketNews } from '../services/geminiService';
import { NewsArticle } from '../types';

interface MarketNewsProps {
  onTriggerAdmin?: () => void;
}

const MarketNews: React.FC<MarketNewsProps> = ({ onTriggerAdmin }) => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchNews = async (query?: string) => {
    setLoading(true);
    const data = await getMarketNews(query);
    setNews(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // COMANDO MAESTRO: Si escribe /admin en el buscador de noticias
    if (search.trim() === '/admin' && onTriggerAdmin) {
      onTriggerAdmin();
      setSearch('');
      return;
    }
    
    fetchNews(search);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-[#111112] p-8 rounded-3xl border border-white/10 shadow-2xl">
        <div className="space-y-1">
          <h2 className="text-3xl font-black text-white flex items-center gap-3">
            <Newspaper className="text-blue-500" />
            Central de Noticias AXQ
          </h2>
          <p className="text-gray-500 text-sm font-medium">Actualizaciones reales del mercado global en tiempo real.</p>
        </div>

        <form onSubmit={handleSearch} className="relative w-full md:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors" size={20} />
          <input
            type="text"
            placeholder="Buscar noticias específicas..."
            className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all shadow-inner"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-64 bg-white/5 rounded-3xl animate-pulse border border-white/5" />
          ))}
        </div>
      ) : news.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((article, idx) => (
            <div key={idx} className="group bg-[#111112] border border-white/10 rounded-3xl overflow-hidden hover:border-blue-500/30 transition-all hover:shadow-[0_0_30px_-10px_rgba(59,130,246,0.2)] flex flex-col">
              <div className="p-6 space-y-4 flex-1">
                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                    article.category === 'Crypto' ? 'bg-orange-500/10 text-orange-400' :
                    article.category === 'Forex' ? 'bg-blue-500/10 text-blue-400' :
                    article.category === 'Gold' ? 'bg-yellow-500/10 text-yellow-400' :
                    'bg-gray-500/10 text-gray-400'
                  }`}>
                    {article.category}
                  </span>
                  <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-bold">
                    <Clock size={12} />
                    {article.timestamp}
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white line-clamp-2 leading-snug group-hover:text-blue-400 transition-colors">
                  {article.title}
                </h3>
                
                <p className="text-sm text-gray-400 line-clamp-3 leading-relaxed">
                  {article.summary}
                </p>
              </div>

              <div className="px-6 py-4 bg-white/[0.02] border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-600/20 flex items-center justify-center text-[10px] font-black text-blue-400">
                    {article.source.charAt(0)}
                  </div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{article.source}</span>
                </div>
                <a 
                  href={article.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 bg-blue-600/10 text-blue-400 rounded-lg hover:bg-blue-600 hover:text-white transition-all"
                >
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-[#111112] rounded-3xl border border-white/10 text-center space-y-4">
          <AlertCircle size={48} className="text-gray-600" />
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-white">No se encontraron noticias</h3>
            <p className="text-gray-500">Intenta con otros términos de búsqueda.</p>
          </div>
          <button onClick={() => fetchNews()} className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm">
            Ver noticias generales
          </button>
        </div>
      )}
    </div>
  );
};

export default MarketNews;
