import React from 'react';
import { cn } from '../../lib/utils';
import { motion, HTMLMotionProps } from 'framer-motion';

interface GradientButtonProps extends HTMLMotionProps<"button"> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  className?: string;
}

export const GradientButton = React.forwardRef<HTMLButtonElement, GradientButtonProps>(
  ({ children, variant = 'primary', className, ...props }, ref) => {
    
    const variants = {
      primary: "bg-gradient-to-r from-primary to-blue-500 text-white shadow-md hover:shadow-primary/30 border-transparent",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 border-transparent",
      outline: "bg-transparent border-primary text-primary hover:bg-primary/10",
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "px-4 py-2 rounded-xl font-medium transition-all duration-200 border",
          variants[variant],
          className
        )}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);
GradientButton.displayName = "GradientButton";
