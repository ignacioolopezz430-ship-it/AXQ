
import React, { useState, useEffect } from 'react';
import { SESSIONS_CONFIG } from '../constants';

const MarketSessions: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getSessionStatus = (start: number, end: number) => {
    const hourUTC = currentTime.getUTCHours();
    if (start < end) {
      return hourUTC >= start && hourUTC < end;
    } else {
      // Overnight sessions (e.g. 22:00 to 05:00)
      return hourUTC >= start || hourUTC < end;
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center gap-4 text-sm font-medium">
      <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
        <span className="text-blue-400">🕒</span>
        <span className="mono">{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
      </div>
      <div className="flex gap-2">
        {SESSIONS_CONFIG.map(session => {
          const isActive = getSessionStatus(session.startHour, session.endHour);
          return (
            <div 
              key={session.name}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all ${
                isActive 
                  ? 'bg-green-500/10 border-green-500/50 text-green-400' 
                  : 'bg-white/5 border-white/10 text-gray-500'
              }`}
            >
              <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-green-400 animate-pulse' : 'bg-gray-600'}`} />
              {session.name}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MarketSessions;
