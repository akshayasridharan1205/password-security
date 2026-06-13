import React, { useState, useEffect } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { GradientButton } from '../ui/GradientButton';
import { Activity, Play, Square, FastForward, Server, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';
import { analyzePassword } from '../../lib/analyzer';

export const Simulator: React.FC = () => {
  const [password, setPassword] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentGuess, setCurrentGuess] = useState('');
  const [attackType, setAttackType] = useState<'brute_force' | 'dictionary'>('brute_force');
  const [hardware, setHardware] = useState<'cpu' | 'gpu' | 'cluster'>('gpu');

  // Hardware speeds (guesses per second)
  const speeds = {
    cpu: 1e6, // 1 Million
    gpu: 1e10, // 10 Billion
    cluster: 1e14 // 100 Trillion
  };

  const analysis = analyzePassword(password);
  const totalGuessesRequired = Math.pow(2, analysis.entropy);
  const estimatedSeconds = totalGuessesRequired / speeds[hardware];

  useEffect(() => {
    let interval: number;
    if (isSimulating) {
      const step = 100 / (estimatedSeconds * 10); // 100ms updates
      interval = window.setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsSimulating(false);
            return 100;
          }
          return prev + step;
        });

        // Simulate random guess visual
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
        let guess = "";
        for (let i = 0; i < (password.length || 8); i++) {
          guess += charset[Math.floor(Math.random() * charset.length)];
        }
        setCurrentGuess(guess);

      }, 100);
    }
    return () => clearInterval(interval);
  }, [isSimulating, estimatedSeconds, password.length]);

  const toggleSimulation = () => {
    if (!password) return;
    if (isSimulating) {
      setIsSimulating(false);
    } else {
      setProgress(0);
      setIsSimulating(true);
    }
  };

  const formatTime = (seconds: number) => {
    if (!seconds || seconds === Infinity) return "Instant";
    if (seconds < 1) return "< 1 second";
    if (seconds < 60) return `${Math.round(seconds)} seconds`;
    if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
    if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
    if (seconds < 31536000) return `${Math.round(seconds / 86400)} days`;
    if (seconds < 3153600000) return `${Math.round(seconds / 31536000)} years`;
    return "Centuries";
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-foreground">Attack Simulator</h2>
        <p className="text-muted-foreground mt-2">Visualize how different attack vectors attempt to crack your password.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <GlassCard>
            <h3 className="text-xl font-bold mb-4">Target Password</h3>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setProgress(0);
                setIsSimulating(false);
              }}
              placeholder="Enter target..."
              className="w-full px-4 py-3 rounded-xl glass-input mb-6"
              disabled={isSimulating}
            />

            <h3 className="font-bold mb-3 text-sm text-muted-foreground uppercase tracking-wider">Attack Vector</h3>
            <div className="space-y-2 mb-6">
              <button
                onClick={() => setAttackType('brute_force')}
                className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${attackType === 'brute_force' ? 'border-primary bg-primary/10 text-primary' : 'border-border glass hover:bg-secondary'}`}
                disabled={isSimulating}
              >
                <span>Brute Force</span>
                <Cpu className="w-4 h-4" />
              </button>
              <button
                onClick={() => setAttackType('dictionary')}
                className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${attackType === 'dictionary' ? 'border-primary bg-primary/10 text-primary' : 'border-border glass hover:bg-secondary'}`}
                disabled={isSimulating}
              >
                <span>Dictionary Hybrid</span>
                <FastForward className="w-4 h-4" />
              </button>
            </div>

            <h3 className="font-bold mb-3 text-sm text-muted-foreground uppercase tracking-wider">Hardware</h3>
            <div className="space-y-2">
              <button
                onClick={() => setHardware('cpu')}
                className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${hardware === 'cpu' ? 'border-primary bg-primary/10 text-primary' : 'border-border glass hover:bg-secondary'}`}
                disabled={isSimulating}
              >
                <span>Standard CPU</span>
                <span className="text-xs">1M/s</span>
              </button>
              <button
                onClick={() => setHardware('gpu')}
                className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${hardware === 'gpu' ? 'border-primary bg-primary/10 text-primary' : 'border-border glass hover:bg-secondary'}`}
                disabled={isSimulating}
              >
                <span>GPU Array (RTX 4090s)</span>
                <span className="text-xs">10B/s</span>
              </button>
              <button
                onClick={() => setHardware('cluster')}
                className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${hardware === 'cluster' ? 'border-primary bg-primary/10 text-primary' : 'border-border glass hover:bg-secondary'}`}
                disabled={isSimulating}
              >
                <span>Nation-State Cluster</span>
                <span className="text-xs">100T/s</span>
              </button>
            </div>
          </GlassCard>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <GlassCard className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold flex items-center">
                <Activity className="w-5 h-5 mr-2 text-primary" />
                Live Simulation
              </h3>
              <GradientButton onClick={toggleSimulation} disabled={!password}>
                {isSimulating ? (
                  <span className="flex items-center"><Square className="w-4 h-4 mr-2" /> Stop</span>
                ) : (
                  <span className="flex items-center"><Play className="w-4 h-4 mr-2" /> Launch Attack</span>
                )}
              </GradientButton>
            </div>

            <div className="flex-1 bg-black/80 rounded-xl p-6 font-mono text-green-500 overflow-hidden relative border border-white/10 shadow-inner">
              {!password ? (
                <div className="h-full flex items-center justify-center text-green-500/30">
                  AWAITING TARGET ACQUISITION...
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between text-xs text-green-500/70 border-b border-green-500/30 pb-2">
                    <span>TARGET: {password.replace(/./g, '*')}</span>
                    <span>ENTROPY: {analysis.entropy.toFixed(1)} bits</span>
                  </div>
                  
                  <div className="text-center py-8">
                    <div className="text-sm text-green-500/70 mb-2">CURRENT GUESS</div>
                    <div className="text-2xl md:text-4xl tracking-widest break-all">
                      {isSimulating ? currentGuess : (progress >= 100 ? password : '-')}
                    </div>
                  </div>

                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="flex justify-between text-xs mb-2">
                      <span>PROGRESS: {progress.toFixed(2)}%</span>
                      <span>EST. TIME: {formatTime(estimatedSeconds)}</span>
                    </div>
                    <div className="h-2 bg-green-900/50 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {progress >= 100 && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 flex items-start"
              >
                <Server className="w-5 h-5 mr-3 mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-bold">SYSTEM BREACHED</h4>
                  <p className="text-sm opacity-80">
                    The target was successfully cracked using {attackType.replace('_', ' ')} in approximately {formatTime(estimatedSeconds)}.
                  </p>
                </div>
              </motion.div>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
