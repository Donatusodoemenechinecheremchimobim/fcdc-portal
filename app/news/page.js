'use client';

import { useState, useEffect } from 'react';
import { Newspaper, RefreshCw, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function IntelFeed() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchNews = async () => {
    setLoading(true);
    try {
      // Using a public RSS-to-JSON bridge to get The Hacker News feed
      const res = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://feeds.feedburner.com/TheHackersNews');
      const data = await res.json();
      setNews(data.items || []);
    } catch (e) {
      console.error("Intel fetch failed");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNews();
  }, []);

  // NEW FUNCTION: Handle the click
  const openReader = (item) => {
    // 1. Pack the Briefcase (Save data)
    localStorage.setItem('current_article', JSON.stringify(item));
    // 2. Go to the Reader Room
    router.push('/news/reader');
  };

  return (
    <div className="min-h-screen bg-cyber-black text-white pt-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10 border-b border-white/10 pb-6">
          <h1 className="text-4xl font-bold flex items-center gap-3">
            <Newspaper className="text-cyber-cyan" /> GLOBAL INTEL FEED
          </h1>
          <button onClick={fetchNews} className="p-2 hover:bg-white/10 rounded-full transition-all">
            <RefreshCw className={`w-6 h-6 text-cyber-green ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-500 font-mono animate-pulse">ESTABLISHING SECURE CONNECTION...</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((item, index) => (
              <article 
                key={index} 
                className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-cyber-green/50 transition-all group flex flex-col h-full"
              >
                <div className="p-6 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-xs font-mono text-gray-500">{item.pubDate.split(' ')[0]}</span>
                    <span className="bg-red-500/10 text-red-400 text-xs px-2 py-1 rounded border border-red-500/20">THREAT_INTEL</span>
                  </div>
                  
                  <h2 className="text-xl font-bold mb-3 group-hover:text-cyber-green transition-colors line-clamp-2">
                    {item.title}
                  </h2>
                  
                  {/* We strip HTML tags for the preview summary */}
                  <p className="text-gray-400 text-sm mb-6 line-clamp-3 flex-grow">
                    {item.description.replace(/<[^>]*>?/gm, '')}
                  </p>
                  
                  <button 
                    onClick={() => openReader(item)}
                    className="mt-auto w-full border border-white/10 py-3 rounded text-sm font-mono flex items-center justify-center gap-2 hover:bg-cyber-green hover:text-black transition-all"
                  >
                    ANALYZE REPORT <ArrowRight className="w-4 h-4" />
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