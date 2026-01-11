'use client';

import { useState } from 'react';
import { Home, MessageSquare, Newspaper, Radiation, Menu, X, FileText } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function CyberNotch() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // HIDE NOTCH ON: Home Page ('/') AND Login Page ('/login')
  if (pathname === '/' || pathname === '/login') return null;

  const links = [
    { href: '/', icon: <Home className="w-4 h-4" />, label: 'HOME' },
    { href: '/forum', icon: <MessageSquare className="w-4 h-4" />, label: 'WAR ROOM' },
    { href: '/news', icon: <Newspaper className="w-4 h-4" />, label: 'INTEL' },
    { href: '/threats', icon: <Radiation className="w-4 h-4 text-red-500" />, label: 'THREATS' },
    { href: '/blog', icon: <FileText className="w-4 h-4" />, label: 'DB' },
  ];

  return (
    <>
      {/* THE NOTCH BAR */}
      <div className="fixed top-0 left-0 w-full z-[100] flex justify-center pointer-events-none mt-2">
        <div className="bg-black/90 backdrop-blur-xl border border-white/10 rounded-full px-4 py-2 pointer-events-auto shadow-[0_0_20px_rgba(0,255,128,0.1)] flex items-center gap-4 transition-all hover:border-cyber-green/50 hover:scale-105">
          
          {/* Active Page Indicator */}
          <span className="text-[10px] font-mono text-cyber-green animate-pulse hidden sm:block">
            {pathname.replace('/', '').toUpperCase()}
          </span>

          <div className="h-4 w-px bg-white/20 hidden sm:block" />

          {/* Mini Links (Desktop) */}
          <div className="hidden sm:flex gap-4">
            {links.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className={`transition-colors hover:text-cyber-green ${pathname === link.href ? 'text-cyber-green' : 'text-gray-400'}`}
              >
                {link.icon}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Trigger */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="sm:hidden text-white"
          >
            {isOpen ? <X className="w-5 h-5 text-red-500" /> : <Menu className="w-5 h-5 text-cyber-green" />}
          </button>
        </div>
      </div>

      {/* MOBILE FULLSCREEN MENU */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[90] bg-cyber-black/95 backdrop-blur-lg flex flex-col items-center justify-center pt-20"
            onClick={() => setIsOpen(false)}
          >
            <div className="grid grid-cols-2 gap-4 p-6 w-full max-w-sm">
              {links.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="bg-white/5 border border-white/10 p-4 rounded-xl flex flex-col items-center gap-2 hover:bg-cyber-green/10 hover:border-cyber-green transition-all"
                >
                  <div className="text-cyber-green">{link.icon}</div>
                  <span className="font-mono text-xs font-bold">{link.label}</span>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}