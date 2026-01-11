'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ExternalLink, Calendar, Bug, Terminal } from 'lucide-react';

export default function ThreatReader() {
  const [threat, setThreat] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedData = localStorage.getItem('current_threat');
    if (storedData) {
      setThreat(JSON.parse(storedData));
    } else {
      router.push('/threats');
    }
  }, [router]);

  if (!threat) return <div className="min-h-screen bg-cyber-black flex items-center justify-center text-red-500 font-mono animate-pulse">LOADING THREAT DATA...</div>;

  return (
    <div className="min-h-screen bg-cyber-black text-white pt-24 px-6 pb-20 border-l-4 border-red-500/20 ml-0 md:ml-4">
      <div className="max-w-4xl mx-auto">
        
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-red-500 mb-8 hover:underline font-mono text-sm uppercase"
        >
          <ArrowLeft className="w-4 h-4" /> Return_To_Database
        </button>

        {/* HEADER */}
        <div className="border-b border-red-500/30 pb-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
             <span className="bg-red-500 text-black font-bold px-3 py-1 rounded text-xs font-mono flex items-center gap-2">
               <Bug className="w-3 h-3" /> ACTIVE_EXPLOIT
             </span>
             <span className="text-gray-500 text-xs font-mono flex items-center gap-2">
               <Calendar className="w-3 h-3" /> {threat.pubDate.split(' ')[0]}
             </span>
          </div>
          
          <h1 className="text-2xl md:text-4xl font-bold leading-tight mb-6 text-white font-mono">
            {threat.title}
          </h1>
        </div>

        {/* CONTENT */}
        <div className="bg-black border border-red-900/30 rounded-xl p-8 md:p-12 relative overflow-hidden shadow-2xl">
           <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
             <Radiation className="w-64 h-64 text-red-500" />
           </div>

           {/* Content Body */}
           <div 
             className="prose prose-invert max-w-none text-gray-400 leading-relaxed font-mono text-sm md:text-base"
             dangerouslySetInnerHTML={{ __html: threat.content || threat.description }} 
           />

           {/* LINKS */}
           <div className="mt-12 pt-8 border-t border-red-900/30 flex flex-col md:flex-row justify-between items-center gap-4">
             <p className="text-red-900 font-mono text-xs">
               DATA_SOURCE: RAPID7_RESEARCH_LABS
             </p>
             <a 
               href={threat.link} 
               target="_blank"
               className="bg-red-600 text-black px-6 py-3 rounded font-bold flex items-center gap-2 hover:bg-red-500 transition-all font-mono"
             >
               OPEN RAPID7 TERMINAL <ExternalLink className="w-4 h-4" />
             </a>
           </div>
        </div>

      </div>
    </div>
  );
}

// Simple Icon Component needed for the reader
function Radiation({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
      <path d="M12 12l0 -9" />
      <path d="M12 12l-7.5 4.5" />
      <path d="M12 12l7.5 4.5" />
      <path d="M4.5 7.5l1.5 -2.5" />
      <path d="M19.5 7.5l-1.5 -2.5" />
      <path d="M4.5 16.5l1.5 2.5" />
      <path d="M19.5 16.5l-1.5 2.5" />
    </svg>
  );
}