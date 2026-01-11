'use client';

import { useState } from 'react';
import { db } from '../../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function CreatePost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const router = useRouter();
  const { data: session } = useSession();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) return;

    await addDoc(collection(db, "posts"), {
      title,
      content,
      author: session?.user?.name || "Anonymous Agent",
      createdAt: serverTimestamp(),
    });

    router.push('/blog');
  };

  if (!session) return <div className="text-white pt-24 text-center">ACCESS DENIED. PLEASE LOGIN.</div>;

  return (
    <div className="min-h-screen bg-cyber-black text-white pt-24 px-6 flex justify-center">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-6 text-cyber-green">NEW_DATABASE_ENTRY</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-mono text-gray-400 mb-2">TITLE</label>
            <input 
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded p-4 text-white focus:border-cyber-green focus:outline-none text-xl font-bold"
              placeholder="Operation Name..."
            />
          </div>
          <div>
            <label className="block text-xs font-mono text-gray-400 mb-2">CONTENT</label>
            <textarea 
              value={content}
              onChange={e => setContent(e.target.value)}
              className="w-full h-64 bg-black/50 border border-white/10 rounded p-4 text-white focus:border-cyber-green focus:outline-none font-mono"
              placeholder="Enter operational details..."
            />
          </div>
          <button type="submit" className="w-full bg-cyber-green text-black font-bold py-4 rounded hover:bg-green-400 transition-all">
            PUBLISH TO DATABASE
          </button>
        </form>
      </div>
    </div>
  );
}