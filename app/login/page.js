'use client';

import { signIn } from "next-auth/react";
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase"; 
import { Shield, Lock, UserPlus } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  // Handle Email Login
  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await signIn("credentials", { 
      email, 
      password, 
      redirect: false,
    });

    if (res?.error) {
      setError("ACCESS DENIED: Invalid Credentials");
    } else {
      router.push("/"); 
    }
  };

  // Handle Registration
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      await signIn("credentials", { email, password, callbackUrl: "/" });
    } catch (err) {
      setError("REGISTRATION FAILED: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-cyber-black flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />

      <motion.div 
        key={isLogin ? "login" : "register"}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-cyber-dark border border-white/10 rounded-xl p-8 shadow-2xl relative z-10"
      >
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-cyber-green/10 rounded-full flex items-center justify-center border border-cyber-green/20">
            {isLogin ? <Lock className="w-8 h-8 text-cyber-green" /> : <UserPlus className="w-8 h-8 text-cyber-cyan" />}
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center mb-2 text-white">
          {isLogin ? "SECURE LOGIN" : "NEW AGENT REGISTRATION"}
        </h1>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-200 text-xs p-2 rounded mb-4 text-center font-mono">
            {error}
          </div>
        )}

        {/* EMAIL FORM */}
        <form onSubmit={isLogin ? handleLogin : handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-cyber-green mb-1">EMAIL_ADDRESS</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:border-cyber-green focus:outline-none font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-mono text-cyber-green mb-1">PASSCODE</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:border-cyber-green focus:outline-none font-mono"
            />
          </div>
          
          <button type="submit" className={`w-full font-bold py-3 rounded transition-all text-black ${isLogin ? 'bg-cyber-green hover:bg-green-400' : 'bg-cyber-cyan hover:bg-cyan-400'}`}>
            {isLogin ? "AUTHENTICATE" : "REGISTER IDENTITY"}
          </button>
        </form>

        {/* GOOGLE LOGIN BUTTON (RESTORED HERE) */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-cyber-dark px-2 text-gray-500">Or Access Via</span></div>
        </div>

        <button 
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="w-full bg-white text-black font-bold py-3 rounded flex items-center justify-center gap-2 hover:bg-gray-200 transition-all mb-4"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.11c-.22-.66-.35-1.36-.35-2.11s.13-1.45.35-2.11V7.05H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.95l3.66-2.84z" fill="#FBBC05"/><path d="M12 4.63c1.61 0 3.06.56 4.21 1.64l3.16-3.16C17.45 1.51 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.05l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
          Sign in with Google
        </button>

        {/* TOGGLE LINK */}
        <div className="text-center">
          <button 
            onClick={() => { setIsLogin(!isLogin); setError(""); }}
            className="text-gray-400 text-sm hover:text-white underline decoration-dashed underline-offset-4"
          >
            {isLogin ? "Apply for new clearance (Sign Up)" : "Already have clearance? Login"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}