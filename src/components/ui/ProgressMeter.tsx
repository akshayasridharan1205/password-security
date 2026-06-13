import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { StrengthClassification } from '../../lib/analyzer';

interface ProgressMeterProps {
  score: number; // 0-100
  classification: StrengthClassification;
  className?: string;
}

export const ProgressMeter: React.FC<ProgressMeterProps> = ({ score, classification, className }) => {
  const getColor = () => {
    switch (classification) {
      case 'Critical': return 'bg-red-600';
      case 'Weak': return 'bg-orange-500';
      case 'Fair': return 'bg-yellow-500';
      case 'Good': return 'bg-blue-500';
      case 'Strong': return 'bg-green-500';
      case 'Elite': return 'bg-purple-600';
      default: return 'bg-gray-500';
    }
  };

  const getLabelColor = () => {
    switch (classification) {
      case 'Critical': return 'text-red-500';
      case 'Weak': return 'text-orange-500';
      case 'Fair': return 'text-yellow-500';
      case 'Good': return 'text-blue-500';
      case 'Strong': return 'text-green-500';
      case 'Elite': return 'text-purple-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className={cn("w-full space-y-2", className)}>
      <div className="flex justify-between items-center text-sm font-medium">
        <span className="text-muted-foreground">Security Strength</span>
        <span className={cn("font-bold transition-colors duration-300", getLabelColor())}>
          {classification}
        </span>
      </div>
      <div className="h-3 w-full bg-secondary rounded-full overflow-hidden relative">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ type: 'spring', stiffness: 50, damping: 15 }}
          className={cn("h-full rounded-full", getColor())}
        />
      </div>
    </div>
  );
};
