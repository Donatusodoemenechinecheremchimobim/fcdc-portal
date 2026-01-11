'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ExternalLink, Calendar, ShieldAlert } from 'lucide-react';

export default function NewsReader() {
  const [article, setArticle] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // 1. Open the "Briefcase" (Get data from storage)
    const storedData = localStorage.getItem('current_article');
    
    if (storedData) {
      setArticle(JSON.parse(storedData));
    } else {
      // If no data found, go back to news feed
      router.push('/news');
    }
  }, [router]);

  if (!article) return <div className="min-h-screen bg-cyber-black flex items-center justify-center text-cyber-green font-mono animate-pulse">DECRYPTING FILE...</div>;

  return (
    <div className="min-h-screen bg-cyber-black text-white pt-24 px-6 pb-20">
      <div className="max-w-4xl mx-auto">
        
        {/* BACK BUTTON */}
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-cyber-green mb-8 hover:underline font-mono text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> RETURN_TO_FEED
        </button>

        {/* HEADER SECTION */}
        <div className="border-b border-white/10 pb-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
             <span className="bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-1 rounded text-xs font-mono flex items-center gap-2">
               <ShieldAlert className="w-3 h-3" /> CLASSIFIED_INTEL
             </span>
             <span className="text-gray-500 text-xs font-mono flex items-center gap-2">
               <Calendar className="w-3 h-3" /> {article.pubDate.split(' ')[0]}
             </span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-6 text-white">
            {article.title}
          </h1>
        </div>

        {/* CONTENT SECTION */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-8 md:p-12 relative overflow-hidden">
           {/* Decorative Background Element */}
           <div className="absolute top-0 right-0 p-4 opacity-10">
             <ShieldAlert className="w-32 h-32" />
           </div>

           {/* The Article Body */}
           <div 
             className="prose prose-invert max-w-none text-gray-300 leading-relaxed text-lg"
             dangerouslySetInnerHTML={{ __html: article.description || article.content }} 
           />

           {/* SOURCE LINK */}
           <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
             <p className="text-gray-500 font-mono text-xs">
               SOURCE_ORIGIN: {new URL(article.link).hostname}
             </p>
             <a 
               href={article.link} 
               target="_blank"
               className="bg-cyber-green text-black px-6 py-3 rounded font-bold flex items-center gap-2 hover:bg-green-400 transition-all"
             >
               ACCESS SOURCE TERMINAL <ExternalLink className="w-4 h-4" />
             </a>
           </div>
        </div>

      </div>
    </div>
  );
}