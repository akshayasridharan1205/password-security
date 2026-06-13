import React, { useState, useEffect } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { GradientButton } from '../ui/GradientButton';
import { Copy, CheckCircle2, RefreshCw, Settings2, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Generator: React.FC = () => {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [useUppercase, setUseUppercase] = useState(true);
  const [useLowercase, setUseLowercase] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [copied, setCopied] = useState(false);

  const generatePassword = () => {
    let charset = '';
    if (useLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (useUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (useNumbers) charset += '0123456789';
    if (useSymbols) charset += '!@#$%^&*()_+~`|}{[]:;?><,./-=';

    if (charset === '') {
      setPassword('');
      return;
    }

    let newPassword = '';
    const randomValues = new Uint32Array(length);
    window.crypto.getRandomValues(randomValues);

    for (let i = 0; i < length; i++) {
      newPassword += charset[randomValues[i] % charset.length];
    }
    
    // Ensure at least one of each selected type
    if (useLowercase && !/[a-z]/.test(newPassword)) return generatePassword();
    if (useUppercase && !/[A-Z]/.test(newPassword)) return generatePassword();
    if (useNumbers && !/[0-9]/.test(newPassword)) return generatePassword();
    if (useSymbols && !/[^a-zA-Z0-9]/.test(newPassword)) return generatePassword();

    setPassword(newPassword);
    setCopied(false);
  };

  useEffect(() => {
    generatePassword();
  }, [length, useUppercase, useLowercase, useNumbers, useSymbols]);

  const copyToClipboard = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getEntropyEstimate = () => {
    let pool = 0;
    if (useLowercase) pool += 26;
    if (useUppercase) pool += 26;
    if (useNumbers) pool += 10;
    if (useSymbols) pool += 32;
    if (pool === 0) return 0;
    return Math.round(length * Math.log2(pool));
  };

  const entropy = getEntropyEstimate();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-foreground">Secure Generator</h2>
        <p className="text-muted-foreground mt-2">Generate cryptographically secure random passwords offline.</p>
      </div>

      <GlassCard className="p-8">
        <div className="relative mb-8">
          <div className="w-full bg-background/50 border border-border/50 rounded-2xl p-6 pr-16 min-h-[100px] flex items-center justify-center break-all text-2xl lg:text-4xl font-mono text-center tracking-wider text-foreground">
            {password || "Select options to generate"}
          </div>
          <button
            onClick={copyToClipboard}
            className="absolute top-1/2 right-6 -translate-y-1/2 p-3 rounded-xl hover:bg-secondary/80 text-muted-foreground hover:text-primary transition-colors"
            title="Copy to clipboard"
          >
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                </motion.div>
              ) : (
                <motion.div key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                  <Copy className="w-6 h-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>

        <div className="flex justify-center mb-10">
          <GradientButton onClick={generatePassword} className="flex items-center text-lg px-8 py-4">
            <RefreshCw className="w-5 h-5 mr-3" />
            Generate New Password
          </GradientButton>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h3 className="text-xl font-bold flex items-center mb-4">
              <Settings2 className="w-5 h-5 mr-2 text-primary" />
              Configuration
            </h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <label className="font-medium">Password Length</label>
                  <span className="text-primary font-mono font-bold">{length}</span>
                </div>
                <input
                  type="range"
                  min="8"
                  max="64"
                  value={length}
                  onChange={(e) => setLength(parseInt(e.target.value))}
                  className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

              <div className="space-y-3 pt-4">
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <input type="checkbox" checked={useUppercase} onChange={(e) => setUseUppercase(e.target.checked)} className="form-checkbox h-5 w-5 text-primary rounded bg-background border-border focus:ring-primary focus:ring-offset-background" />
                  <span className="text-foreground font-medium group-hover:text-primary transition-colors">Uppercase Letters (A-Z)</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <input type="checkbox" checked={useLowercase} onChange={(e) => setUseLowercase(e.target.checked)} className="form-checkbox h-5 w-5 text-primary rounded bg-background border-border focus:ring-primary focus:ring-offset-background" />
                  <span className="text-foreground font-medium group-hover:text-primary transition-colors">Lowercase Letters (a-z)</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <input type="checkbox" checked={useNumbers} onChange={(e) => setUseNumbers(e.target.checked)} className="form-checkbox h-5 w-5 text-primary rounded bg-background border-border focus:ring-primary focus:ring-offset-background" />
                  <span className="text-foreground font-medium group-hover:text-primary transition-colors">Numbers (0-9)</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer group">
                  <input type="checkbox" checked={useSymbols} onChange={(e) => setUseSymbols(e.target.checked)} className="form-checkbox h-5 w-5 text-primary rounded bg-background border-border focus:ring-primary focus:ring-offset-background" />
                  <span className="text-foreground font-medium group-hover:text-primary transition-colors">Symbols (!@#$)</span>
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-bold flex items-center mb-4">
              <ShieldCheck className="w-5 h-5 mr-2 text-primary" />
              Security Profile
            </h3>
            
            <div className="glass p-6 rounded-xl space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Estimated Entropy</span>
                <span className="text-xl font-bold font-mono">{entropy} <span className="text-sm font-normal text-muted-foreground">bits</span></span>
              </div>
              <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                <div 
                  className={`h-full ${entropy > 100 ? 'bg-purple-500' : entropy > 80 ? 'bg-green-500' : entropy > 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                  style={{ width: `${Math.min(100, (entropy / 128) * 100)}%` }}
                />
              </div>
              <p className="text-sm text-muted-foreground mt-4 leading-relaxed">
                {entropy > 100 ? "This password provides elite, future-proof security." :
                 entropy > 80 ? "This password is highly secure against all offline attacks." :
                 entropy > 50 ? "This password is secure for general use but could be longer." :
                 "This password is weak. Increase length or complexity."}
              </p>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};
