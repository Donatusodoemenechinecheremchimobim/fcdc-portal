'use client';

import { useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, limit, doc, getDoc, setDoc } from 'firebase/firestore';
import { useSession } from 'next-auth/react';
import { Send, Shield, UserCircle, Fingerprint } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function WarRoom() {
  const { data: session } = useSession();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [codename, setCodename] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newAlias, setNewAlias] = useState('');
  
  const dummyDiv = useRef(null);
  const router = useRouter();

  // 1. CHECK FOR EXISTING CODENAME
  useEffect(() => {
    if (!session?.user?.email) {
      if (session === null) setLoading(false);
      return;
    }

    const checkIdentity = async () => {
      try {
        const userRef = doc(db, "users", session.user.email);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setCodename(userSnap.data().username);
        }
      } catch (error) {
        console.error("Identity check failed:", error);
      }
      setLoading(false);
    };

    checkIdentity();
  }, [session]);

  // 2. LISTEN FOR MESSAGES
  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("createdAt"), limit(50));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
      setTimeout(() => dummyDiv.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    });
    return () => unsubscribe();
  }, []);

  // 3. REGISTER FUNCTION (The one that was broken)
  const registerIdentity = async (e) => {
    e.preventDefault();
    if (!newAlias.trim()) return;

    try {
      await setDoc(doc(db, "users", session.user.email), {
        username: newAlias.toUpperCase(),
        email: session.user.email,
        joinedAt: serverTimestamp()
      });
      setCodename(newAlias.toUpperCase());
    } catch (error) {
      console.error("Registration Error:", error);
      alert("Error creating identity. Check console.");
    }
  };

  // 4. SEND MESSAGE FUNCTION (This was missing!)
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !codename) return;

    try {
      await addDoc(collection(db, "messages"), {
        text: newMessage,
        createdAt: serverTimestamp(),
        user: codename,
        uid: session.user.email, 
      });
      setNewMessage('');
    } catch (error) {
      console.error("Send Error:", error);
    }
  };

  // --- RENDER STATES ---

  // State 1: Not Logged In
  if (!session && !loading) {
    return (
      <div className="min-h-screen bg-cyber-black text-white flex items-center justify-center p-4">
        <div className="text-center max-w-md bg-cyber-dark border border-white/10 p-8 rounded-xl">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold font-mono mb-2">ACCESS DENIED</h1>
          <p className="text-gray-400 mb-6 font-mono text-sm">ENCRYPTED CHANNEL. LOGIN REQUIRED.</p>
          <button onClick={() => router.push('/login')} className="bg-cyber-green text-black px-8 py-3 rounded font-bold hover:bg-green-400 font-mono">
            AUTHENTICATE
          </button>
        </div>
      </div>
    );
  }

  // State 2: Loading
  if (loading) return <div className="min-h-screen bg-cyber-black text-cyber-green flex items-center justify-center font-mono animate-pulse">DECRYPTING IDENTITY...</div>;

  // State 3: Register Identity
  if (!codename) {
    return (
      <div className="min-h-screen bg-cyber-black text-white flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
        <div className="max-w-md w-full bg-cyber-dark border border-cyber-green/30 p-8 rounded-xl shadow-2xl relative z-10">
          <div className="flex justify-center mb-6">
            <Fingerprint className="w-16 h-16 text-cyber-cyan animate-pulse" />
          </div>
          <h1 className="text-2xl font-bold text-center mb-2">IDENTITY REQUIRED</h1>
          <form onSubmit={registerIdentity} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-cyber-green mb-1">SELECT_CODENAME</label>
              <input 
                value={newAlias}
                onChange={(e) => setNewAlias(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:border-cyber-green focus:outline-none font-mono uppercase"
                placeholder="Ex: ZERO_COOL"
                maxLength={15}
                required
              />
            </div>
            <button type="submit" className="w-full bg-cyber-cyan text-black font-bold py-3 rounded hover:bg-cyan-400 transition-all font-mono">
              ESTABLISH IDENTITY
            </button>
          </form>
        </div>
      </div>
    );
  }

  // State 4: Chat Room
  return (
    <div className="min-h-screen bg-cyber-black text-white pt-24 px-4 pb-4 flex flex-col">
      <div className="fixed inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
      
      <div className="max-w-4xl mx-auto w-full mb-4 flex items-center justify-between border-b border-white/10 pb-4">
        <h1 className="text-2xl font-bold flex items-center gap-2 text-cyber-green">
          <Shield className="w-6 h-6" /> WAR ROOM <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded animate-pulse">LIVE</span>
        </h1>
        <div className="flex items-center gap-2 text-xs font-mono text-gray-500 bg-white/5 px-3 py-1 rounded-full border border-white/10">
          <UserCircle className="w-4 h-4 text-cyber-cyan" />
          <span className="text-cyber-cyan">{codename}</span>
        </div>
      </div>

      <div className="flex-1 max-w-4xl mx-auto w-full overflow-y-auto bg-black/30 rounded-lg border border-white/10 p-4 mb-4 space-y-4 custom-scrollbar shadow-inner">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.uid === session.user.email ? 'items-end' : 'items-start'}`}>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[10px] font-mono opacity-70 ${msg.uid === session.user.email ? 'text-cyber-green' : 'text-cyber-cyan'}`}>
                {msg.user}
              </span>
            </div>
            <div className={`px-4 py-2 rounded-lg max-w-[85%] break-words text-sm shadow-md ${
              msg.uid === session.user.email 
                ? 'bg-cyber-green/10 border border-cyber-green/20 text-green-100 rounded-br-none' 
                : 'bg-white/10 border border-white/5 text-gray-200 rounded-bl-none'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={dummyDiv}></div>
      </div>

      <form onSubmit={sendMessage} className="max-w-4xl mx-auto w-full flex gap-2">
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder={`Transmit secure message as ${codename}...`}
          className="flex-1 bg-black/50 border border-white/10 rounded-lg p-4 text-white focus:border-cyber-green focus:outline-none font-mono text-sm shadow-lg transition-all"
        />
        <button type="submit" className="bg-cyber-green text-black px-6 rounded-lg font-bold hover:bg-green-400 transition-colors shadow-lg shadow-cyber-green/20">
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}