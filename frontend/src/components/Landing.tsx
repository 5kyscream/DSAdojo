import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Landing() {
  const [step, setStep] = useState<'LOGIN' | 'SIGNUP' | 'ONBOARDING'>('LOGIN');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorLine, setErrorLine] = useState('');
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorLine('');
    
    if (step === 'SIGNUP') {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) setErrorLine(error.message);
      else if (data.session) setStep('ONBOARDING');
      else setErrorLine('Check your email for the confirmation link.');
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setErrorLine(error.message);
      } else if (data.user?.user_metadata?.level) {
        navigate('/dashboard');
      } else {
        setStep('ONBOARDING');
      }
    }
  };

  const handleOAuth = async (provider: 'github' | 'google') => {
    const { error } = await supabase.auth.signInWithOAuth({ provider });
    if (error) setErrorLine(error.message);
  };

  const handleLevelSelect = async (level: string) => {
    await supabase.auth.updateUser({ data: { level } });
    navigate('/dashboard');
  };

  return (
    <div className="flex-1 min-h-[calc(100vh-100px)] flex bg-background relative overflow-hidden items-center justify-center p-8">
      {/* Massive Typography */}
      <h1 className="absolute z-0 text-[18vw] font-display font-black text-surface opacity-20 select-none whitespace-nowrap top-1/2 -translate-y-1/2">
        COMMAND
      </h1>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md border-2 brutalist-border p-8 bg-background/90 backdrop-blur-md box-glow"
      >
        <div className="flex items-center gap-2 mb-8 border-b brutalist-border pb-4">
          <Shield className="w-8 h-8 text-primary" />
          <h2 className="font-display font-bold tracking-widest text-primary text-xl">ACCESS_AUTH</h2>
        </div>

        {(step === 'LOGIN' || step === 'SIGNUP') && (
          <form onSubmit={handleAuth} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="font-mono text-xs text-text-muted">[EMAIL_IDENTIFIER]</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Agent Email" 
                className="bg-surface border-2 brutalist-border p-3 font-mono text-sm outline-none focus:border-primary transition-colors text-text-main placeholder:text-text-muted/50"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-mono text-xs text-text-muted">[ACCESS_KEY]</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="bg-surface border-2 brutalist-border p-3 font-mono text-sm outline-none focus:border-primary transition-colors text-text-main placeholder:text-text-muted/50"
              />
            </div>

            {errorLine && <span className="font-mono text-xs text-primary">{'>_ ERROR: '} {errorLine}</span>}

            <button type="submit" className="bg-primary text-black font-display font-bold text-xl py-4 clip-chamfer hover:scale-[1.02] transition-transform w-full flex justify-center items-center gap-2 mt-2">
              {step === 'SIGNUP' ? 'REGISTER' : 'AUTHENTICATE'} <ChevronRight className="w-5 h-5" />
            </button>

            <div className="flex gap-4">
              <button 
                type="button" 
                onClick={() => handleOAuth('github')} 
                className="flex-1 bg-surface border border-surface hover:border-text-muted p-3 font-mono text-[10px] tracking-widest font-bold text-text-muted transition-colors clip-chamfer"
              >
                [GITHUB_OAUTH]
              </button>
              <button 
                type="button" 
                onClick={() => handleOAuth('google')} 
                className="flex-1 bg-surface border border-surface hover:border-text-muted p-3 font-mono text-[10px] tracking-widest font-bold text-text-muted transition-colors clip-chamfer"
              >
                [GOOGLE_OAUTH]
              </button>
            </div>

            <button 
              type="button" 
              onClick={() => setStep(step === 'LOGIN' ? 'SIGNUP' : 'LOGIN')}
              className="font-mono text-xs text-lavender hover:text-primary transition-colors mt-2"
            >
              {step === 'LOGIN' ? '[INITIATE_NEW_REGISTRATION]' : '[RETURN_TO_LOGIN]'}
            </button>
          </form>
        )}

        {step === 'ONBOARDING' && (
          <div className="flex flex-col gap-4">
             <h3 className="font-mono text-[10px] text-lavender mb-2 uppercase tracking-widest">[CALIBRATION_REQUIRED] Input Tactical Experience</h3>
             {['BEGINNER', 'INTERMEDIATE', 'PROFESSIONAL'].map((level) => (
               <button 
                 key={level}
                 onClick={() => handleLevelSelect(level)}
                 className="border-2 border-surface p-4 font-display font-bold hover:bg-primary hover:border-primary hover:text-black transition-colors text-left flex justify-between group"
               >
                 {level}
                 <span className="font-mono text-xs opacity-0 group-hover:opacity-100">{'>_'} LOCK IN</span>
               </button>
             ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
