'use client';

import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { FileText, Plus, User, Database } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function BlogList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        setPosts(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
      } catch (e) {
        console.error("Database error");
      }
      setLoading(false);
    };
    fetchPosts();
  }, []);

  return (
    // Added 'pt-32' to push content down below the Notch
    <div className="min-h-screen bg-cyber-black text-white pt-32 px-4 md:px-6 overflow-x-hidden">
      <div className="max-w-5xl mx-auto">
        
        {/* HEADER FIX: Stack vertically on mobile (flex-col), row on desktop (md:flex-row) */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4 border-b border-white/10 pb-6">
          
          <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
            <Database className="text-cyber-green w-8 h-8 md:w-10 md:h-10" /> 
            <span>DATABASE</span>
          </h1>

          {session && (
            <Link href="/blog/create" className="w-full md:w-auto">
              <button className="w-full md:w-auto bg-cyber-green text-black px-6 py-3 rounded font-bold flex items-center justify-center gap-2 hover:bg-green-400 transition-all font-mono text-sm shadow-[0_0_15px_rgba(0,255,128,0.3)]">
                <Plus className="w-4 h-4" /> NEW_ENTRY
              </button>
            </Link>
          )}
        </div>

        {/* LOADING STATE */}
        {loading && (
          <div className="text-center py-20 text-gray-500 font-mono animate-pulse">
            ACCESSING ARCHIVES...
          </div>
        )}

        {/* BLOG LIST */}
        <div className="space-y-6 pb-20">
          {!loading && posts.map((post) => (
            <div key={post.id} className="bg-white/5 border border-white/10 rounded-lg p-6 hover:border-cyber-green/30 transition-all shadow-lg group">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-xl md:text-2xl font-bold text-white group-hover:text-cyber-green transition-colors break-words">
                  {post.title}
                </h2>
              </div>
              
              <div className="flex flex-wrap gap-4 text-xs font-mono text-gray-500 mb-4 border-b border-white/5 pb-4">
                <span className="flex items-center gap-1 text-cyber-cyan">
                  <User className="w-3 h-3" /> {post.author}
                </span>
                <span>
                  {post.createdAt?.seconds 
                    ? new Date(post.createdAt.seconds * 1000).toLocaleDateString() 
                    : 'DATE_UNKNOWN'}
                </span>
              </div>
              
              <p className="text-gray-300 leading-relaxed whitespace-pre-wrap font-mono text-sm md:text-base">
                {post.content}
              </p>
            </div>
          ))}

          {!loading && posts.length === 0 && (
            <div className="text-center text-gray-500 font-mono py-10 border border-dashed border-white/10 rounded-lg">
              NO RECORDS FOUND. BE THE FIRST TO CONTRIBUTE.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}