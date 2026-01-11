'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Shield, Lock, ChevronRight, Code, LogOut, MessageSquare, Newspaper, FileText, Menu, X } from 'lucide-react';
import { SessionProvider, useSession, signOut } from "next-auth/react";
import Link from 'next/link';
import { useState } from 'react';

// 1. Session Wrapper
export default function HomeWrapper() {
  return (
    <SessionProvider>
      <Home />
    </SessionProvider>
  );
}

// 2. Main Page Component
function Home() {
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <main className="min-h-screen bg-cyber-black text-white font-sans selection:bg-cyber-green selection:text-black overflow-x-hidden">
      
      {/* BACKGROUND GRID */}
      <div className="fixed inset-0 bg-grid-pattern opacity-[0.05] cyber-grid pointer-events-none" />

      {/* NAVBAR */}
      <nav className="fixed w-full z-50 bg-cyber-black/90 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* LOGO */}
          <div className="flex items-center gap-2 z-50 relative">
            <Shield className="w-8 h-8 text-cyber-green" />
            <span className="font-bold text-lg md:text-xl tracking-tighter">
              FUTO<span className="text-cyber-green">CYBER</span>
            </span>
          </div>
          
          {/* DESKTOP NAVIGATION (Hidden on Mobile) */}
          <div className="hidden md:flex gap-6 text-xs font-mono text-gray-400">
            <NavLink href="/" icon={null} text="./HOME" />
            <NavLink href="/forum" icon={<MessageSquare className="w-3 h-3" />} text="./WAR_ROOM" />
            <NavLink href="/news" icon={<Newspaper className="w-3 h-3" />} text="./INTEL" />
            <NavLink href="/threats" icon={<Shield className="w-3 h-3 text-red-500" />} text="./THREATS" />
            <NavLink href="/blog" icon={<FileText className="w-3 h-3" />} text="./DATABASE" />
          </div>

          {/* AUTH BUTTONS (Desktop) */}
          <div className="hidden md:flex items-center gap-4">
            {session ? (
              <div className="flex items-center gap-4">
                <span className="text-xs font-mono text-cyber-green uppercase">
                  OP: {session.user.name || "AGENT"}
                </span>
                <button onClick={() => signOut()} className="bg-red-500/10 hover:bg-red-500 hover:text-white border border-red-500/20 px-4 py-2 rounded text-sm font-mono transition-all flex items-center gap-2">
                  <LogOut className="w-4 h-4" /> LOGOUT
                </button>
              </div>
            ) : (
              <Link href="/login">
                <button className="bg-white/5 hover:bg-cyber-green hover:text-black border border-white/10 px-4 py-2 rounded text-sm font-mono transition-all duration-300">
                  ACCESS_PORTAL
                </button>
              </Link>
            )}
          </div>

          {/* MOBILE MENU TOGGLE (Visible on Mobile) */}
          <button 
            className="md:hidden z-50 text-white p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-8 h-8 text-red-500" /> : <Menu className="w-8 h-8 text-cyber-green" />}
          </button>
        </div>

        {/* MOBILE MENU DROPDOWN */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-20 left-0 w-full bg-cyber-black border-b border-white/10 md:hidden flex flex-col p-6 gap-4 shadow-2xl"
            >
              <MobileLink href="/" text="HOME" />
              <MobileLink href="/forum" text="WAR ROOM (CHAT)" />
              <MobileLink href="/news" text="INTEL FEED" />
              <MobileLink href="/threats" text="THREAT DATABASE" />
              <MobileLink href="/blog" text="DATABASE" />
              
              <div className="h-px bg-white/10 my-2" />
              
              {session ? (
                <button onClick={() => signOut()} className="text-red-400 font-mono text-left py-2">
                  LOGOUT AGENT {session.user.name}
                </button>
              ) : (
                <Link href="/login" className="bg-cyber-green text-black text-center py-3 rounded font-bold">
                  LOGIN / REGISTER
                </Link>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-screen flex flex-col justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyber-green/10 text-cyber-green text-xs font-mono mb-6 border border-cyber-green/20">
            <span className="w-2 h-2 rounded-full bg-cyber-green animate-pulse" />
            SYSTEM STATUS: ONLINE
          </div>
          
          <h1 className="text-5xl md:text-8xl font-bold tracking-tighter mb-6 glitch-text leading-tight">
            SECURE THE <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-green to-cyber-cyan">
              FUTURE.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mb-10 leading-relaxed">
            We are the FUTO Cyber Defenders. An elite collective of student researchers defending the digital frontier.
          </p>

          {/* MOBILE OPTIMIZED BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            {session ? (
               <Link href="/forum" className="w-full sm:w-auto">
                 <button className="group relative w-full sm:w-auto px-8 py-4 bg-cyber-cyan text-black font-bold rounded overflow-hidden">
                   <span className="relative flex items-center justify-center gap-2">
                     ENTER WAR ROOM <ChevronRight className="w-4 h-4" />
                   </span>
                 </button>
               </Link>
            ) : (
              <Link href="/login" className="w-full sm:w-auto">
                <button className="group relative w-full sm:w-auto px-8 py-4 bg-cyber-green text-black font-bold rounded overflow-hidden">
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  <span className="relative flex items-center justify-center gap-2">
                    INITIATE LOGIN <ChevronRight className="w-4 h-4" />
                  </span>
                </button>
              </Link>
            )}

            <button className="w-full sm:w-auto px-8 py-4 border border-white/10 rounded hover:bg-white/5 transition-colors font-mono text-gray-300">
              VIEW_GITHUB_REPO
            </button>
          </div>
        </motion.div>

        {/* TERMINAL ANIMATION (Only visible on Desktop to save space on Mobile) */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="absolute right-0 top-1/2 -translate-y-1/2 hidden lg:block w-[500px] h-[300px] bg-black border border-white/10 rounded-lg p-4 font-mono text-xs text-gray-400 shadow-2xl shadow-cyber-green/5"
        >
          <div className="flex gap-2 mb-4 border-b border-white/10 pb-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <div className="space-y-2">
            <p><span className="text-cyber-green">user@fcdc:~$</span> ./mirage_loader.exe</p>
            <p className="text-white">[+] TARGET ACQUIRED. PID: 2132</p>
            <p className="text-cyber-cyan">[SUCCESS] BYPASSING WINDOWS DEFENDER...</p>
            <p className="text-cyber-green">[✓] ACCESS GRANTED.</p>
            <p className="animate-pulse">_</p>
          </div>
        </motion.div>
      </section>

      {/* DOMAINS SECTION */}
      <section className="py-20 bg-cyber-dark/50 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-12 flex items-center gap-3">
            <Terminal className="text-cyber-cyan" />
            OPERATIONAL DOMAINS
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card 
              icon={<Lock className="w-8 h-8 text-red-400" />}
              title="Red Teaming"
              desc="Advanced penetration testing and exploit development."
            />
            <Card 
              icon={<Shield className="w-8 h-8 text-cyber-green" />}
              title="Blue Teaming"
              desc="Network defense, incident response, and malware analysis."
            />
            <Card 
              icon={<Code className="w-8 h-8 text-cyber-cyan" />}
              title="Secure Coding"
              desc="Building resilient systems using Rust, Go, and Python."
            />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 border-t border-white/10 text-center text-gray-500 text-sm font-mono">
        <p>FUTO CYBER DEFENDERS CLUB © 2026</p>
      </footer>
    </main>
  );
}

// Helper Components for Cleaner Code
function NavLink({ href, icon, text }) {
  return (
    <Link href={href} className="hover:text-cyber-green transition-colors flex items-center gap-1">
      {icon} {text}
    </Link>
  );
}

function MobileLink({ href, text }) {
  return (
    <Link href={href} className="text-lg font-mono text-gray-300 hover:text-cyber-green py-2 border-b border-white/5">
      {text}
    </Link>
  );
}

function Card({ icon, title, desc }) {
  return (
    <div className="p-8 rounded-xl bg-white/5 border border-white/5 hover:border-cyber-green/50 transition-all duration-300">
      <div className="mb-6 p-4 rounded-lg bg-black/50 w-fit">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 text-white">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{desc}</p>
    </div>
  );
}