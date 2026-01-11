'use client';

import { useState, useEffect } from 'react';
import { Radiation, RefreshCw, ArrowRight, Bug, ShieldAlert } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ThreatDB() {
  const [threats, setThreats] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchThreats = async () => {
    setLoading(true);
    try {
      // Switched to BleepingComputer for reliable, high-frequency threat intel
      const res = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://www.bleepingcomputer.com/feed/');
      const data = await res.json();
      setThreats(data.items || []);
    } catch (e) {
      console.error("Threat fetch failed");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchThreats();
  }, []);

  const openReader = (item) => {
    // Save the specific article to local storage so the Reader page can load it
    localStorage.setItem('current_threat', JSON.stringify(item));
    router.push('/threats/reader');
  };

  return (
    // 'overflow-x-hidden' stops the mobile wobble
    // 'pt-32' pushes content down below the floating Notch
    <div className="min-h-screen bg-cyber-black text-white pt-32 px-4 pb-24 overflow-x-hidden w-full">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER SECTION */}
        <div className="flex justify-between items-center mb-10 border-b border-red-500/20 pb-6">
          <h1 className="text-2xl md:text-4xl font-bold flex items-center gap-3 text-red-500">
            <Radiation className="w-8 h-8 md:w-10 md:h-10 animate-pulse" /> 
            <span>THREAT_DB</span>
          </h1>
          <button 
            onClick={fetchThreats} 
            className="p-3 hover:bg-white/10 rounded-full transition-all group"
            title="Refresh Intel"
          >
            <RefreshCw className={`w-6 h-6 text-red-500 group-hover:rotate-180 transition-transform duration-700 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* CONTENT GRID */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-red-500/50 font-mono">
             <ShieldAlert className="w-12 h-12 animate-pulse" />
             <p>SCANNING GLOBAL NETWORKS...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {threats.map((item, index) => (
              <article 
                key={index} 
                className="bg-black/40 backdrop-blur border border-red-900/30 rounded-xl overflow-hidden hover:border-red-500 transition-all flex flex-col h-full shadow-lg group relative"
              >
                {/* Decorative corner glow */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-red-500/5 blur-xl group-hover:bg-red-500/10 transition-all" />

                <div className="p-6 flex flex-col h-full z-10">
                  {/* Meta Data */}
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">
                      {item.pubDate.split(' ')[0]}
                    </span>
                    <span className="bg-red-500/10 border border-red-500/20 text-red-400 font-bold text-[10px] px-2 py-1 rounded flex items-center gap-1 font-mono">
                      <Bug className="w-3 h-3" /> ACTIVE_THREAT
                    </span>
                  </div>
                  
                  {/* Title */}
                  <h2 className="text-lg font-bold mb-3 text-gray-200 group-hover:text-red-400 transition-colors line-clamp-2 font-mono leading-tight">
                    {item.title}
                  </h2>
                  
                  {/* Summary (Stripped of HTML) */}
                  <p className="text-gray-500 text-xs md:text-sm mb-6 line-clamp-3 flex-grow font-mono leading-relaxed">
                    {item.description.replace(/<[^>]*>?/gm, '')}
                  </p>
                  
                  {/* Action Button */}
                  <button 
                    onClick={() => openReader(item)}
                    className="mt-auto w-full border border-red-500/30 py-3 rounded text-xs font-mono flex items-center justify-center gap-2 text-red-400 hover:bg-red-500 hover:text-black transition-all font-bold tracking-tight"
                  >
                    VIEW EXPLOIT DATA <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}