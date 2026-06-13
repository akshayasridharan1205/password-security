import React, { useState, useEffect } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { ProgressMeter } from '../ui/ProgressMeter';
import { analyzePassword, AnalysisResult } from '../../lib/analyzer';
import { generateAIAdvice, AIAdvice } from '../../lib/ai-advisor';
import { Eye, EyeOff, ShieldCheck, AlertTriangle, Info as InfoIcon, Zap, ShieldAlert, KeyRound } from 'lucide-react';
import { usePrivacyMode } from '../../lib/usePrivacyMode';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export const Analyzer: React.FC = () => {
  const [password, setPassword] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult>(analyzePassword(''));
  const [advice, setAdvice] = useState<AIAdvice[]>(generateAIAdvice('', analysis));
  const { isIdle, privacyEnabled, setPrivacyEnabled, setIsIdle } = usePrivacyMode(30000); // 30s timeout

  useEffect(() => {
    const res = analyzePassword(password);
    setAnalysis(res);
    setAdvice(generateAIAdvice(password, res));
    if (password) setIsIdle(false);
  }, [password, setIsIdle]);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const getAdviceIcon = (type: string) => {
    switch (type) {
      case 'critical': return <ShieldAlert className="w-5 h-5 text-red-500" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'positive': return <ShieldCheck className="w-5 h-5 text-green-500" />;
      default: return <InfoIcon className="w-5 h-5 text-blue-500" />;
    }
  };

  const getAdviceColor = (type: string) => {
    switch (type) {
      case 'critical': return 'border-red-500/20 bg-red-500/5';
      case 'warning': return 'border-yellow-500/20 bg-yellow-500/5';
      case 'positive': return 'border-green-500/20 bg-green-500/5';
      default: return 'border-blue-500/20 bg-blue-500/5';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Password Analyzer</h2>
          <p className="text-muted-foreground mt-2">Real-time enterprise-grade security analysis.</p>
        </div>
        <button
          onClick={() => setPrivacyEnabled(!privacyEnabled)}
          className={cn(
            "flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300",
            privacyEnabled ? "bg-primary/20 text-primary border border-primary/30" : "glass text-muted-foreground hover:text-foreground"
          )}
        >
          {privacyEnabled ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
          Privacy Mode {privacyEnabled ? 'On' : 'Off'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <GlassCard className="relative z-10">
            {isIdle && privacyEnabled && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 z-50 backdrop-blur-xl bg-background/50 flex flex-col items-center justify-center rounded-2xl"
              >
                <EyeOff className="w-12 h-12 text-muted-foreground mb-4 animate-pulse-slow" />
                <h3 className="text-xl font-bold">Privacy Mode Active</h3>
                <p className="text-muted-foreground mt-2">Press any key or move mouse to reveal.</p>
              </motion.div>
            )}

            <div className="relative mb-8">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <KeyRound className="w-6 h-6 text-muted-foreground" />
              </div>
              <input
                type={isVisible ? "text" : "password"}
                value={password}
                onChange={handlePasswordChange}
                placeholder="Enter password to analyze..."
                className="w-full pl-12 pr-12 py-4 text-xl font-mono rounded-xl glass-input placeholder:text-muted-foreground/50 transition-all text-foreground"
              />
              <button
                onClick={() => setIsVisible(!isVisible)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-muted-foreground hover:text-primary transition-colors"
                tabIndex={-1}
              >
                {isVisible ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
              </button>
            </div>

            <ProgressMeter score={analysis.score} classification={analysis.classification} className="mb-8" />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl glass bg-card/40 flex flex-col items-center justify-center text-center">
                <span className="text-muted-foreground text-sm mb-1">Entropy</span>
                <span className="text-2xl font-bold font-mono">{analysis.entropy.toFixed(1)}</span>
                <span className="text-xs text-muted-foreground mt-1">bits</span>
              </div>
              <div className="p-4 rounded-xl glass bg-card/40 flex flex-col items-center justify-center text-center">
                <span className="text-muted-foreground text-sm mb-1">Length</span>
                <span className="text-2xl font-bold font-mono">{analysis.details.length}</span>
                <span className="text-xs text-muted-foreground mt-1">chars</span>
              </div>
              <div className="p-4 rounded-xl glass bg-card/40 flex flex-col items-center justify-center text-center">
                <span className="text-muted-foreground text-sm mb-1">Complexity</span>
                <span className="text-2xl font-bold font-mono">{analysis.zxcvbnScore}/4</span>
                <span className="text-xs text-muted-foreground mt-1">level</span>
              </div>
              <div className="p-4 rounded-xl glass bg-card/40 flex flex-col items-center justify-center text-center">
                <span className="text-muted-foreground text-sm mb-1">Crack Time</span>
                <span className="text-xl font-bold whitespace-nowrap overflow-hidden text-ellipsis w-full px-2" title={analysis.crackTimeDisplay}>
                  {analysis.crackTimeDisplay}
                </span>
                <span className="text-xs text-muted-foreground mt-1">offline</span>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <Zap className="w-5 h-5 mr-2 text-primary" />
              Advanced Metrics
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex justify-between items-center p-3 rounded-lg bg-background/40 border border-border">
                <span className="text-muted-foreground">Uppercase</span>
                <span className={analysis.details.hasUppercase ? "text-green-500 font-bold" : "text-red-500 font-bold"}>
                  {analysis.details.hasUppercase ? "Yes" : "No"}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-background/40 border border-border">
                <span className="text-muted-foreground">Lowercase</span>
                <span className={analysis.details.hasLowercase ? "text-green-500 font-bold" : "text-red-500 font-bold"}>
                  {analysis.details.hasLowercase ? "Yes" : "No"}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-background/40 border border-border">
                <span className="text-muted-foreground">Numbers</span>
                <span className={analysis.details.hasNumbers ? "text-green-500 font-bold" : "text-red-500 font-bold"}>
                  {analysis.details.hasNumbers ? "Yes" : "No"}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-background/40 border border-border">
                <span className="text-muted-foreground">Symbols</span>
                <span className={analysis.details.hasSymbols ? "text-green-500 font-bold" : "text-red-500 font-bold"}>
                  {analysis.details.hasSymbols ? "Yes" : "No"}
                </span>
              </div>
            </div>
          </GlassCard>
        </div>

        <div className="lg:col-span-1">
          <GlassCard className="h-full flex flex-col">
            <h3 className="text-xl font-bold mb-6 flex items-center text-gradient">
              AI Security Advisor
            </h3>
            
            <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
              <AnimatePresence mode="popLayout">
                {advice.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: index * 0.1 }}
                    className={cn(
                      "p-4 rounded-xl border",
                      getAdviceColor(item.type)
                    )}
                  >
                    <div className="flex items-start mb-2">
                      <div className="mt-1 mr-3 shrink-0">
                        {getAdviceIcon(item.type)}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm mb-1">{item.insight}</h4>
                        <p className="text-sm text-muted-foreground">{item.actionable}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
