import React from 'react';
import { Shield, Activity, KeyRound, LineChart, Settings, Info } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

const navItems = [
  { icon: Shield, label: 'Analyzer', id: 'analyzer' },
  { icon: KeyRound, label: 'Generator', id: 'generator' },
  { icon: Activity, label: 'Simulator', id: 'simulator' },
  { icon: LineChart, label: 'Analytics', id: 'analytics' },
];

interface SidebarProps {
  activeTab: string;
  setActiveTab: (id: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <aside className="w-20 lg:w-64 h-full glass flex flex-col items-center lg:items-start py-8 transition-all duration-300 z-10 border-r border-border/50">
      <div className="px-0 lg:px-8 mb-12 flex items-center justify-center lg:justify-start w-full">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg shadow-primary/20">
          <Shield className="text-white w-6 h-6" />
        </div>
        <h1 className="hidden lg:block ml-4 text-2xl font-black tracking-tight text-gradient">
          Obsidian
        </h1>
      </div>

      <nav className="flex-1 w-full px-4 space-y-2">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center p-3 rounded-xl transition-all duration-200 relative group",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-primary/10 border border-primary/20 rounded-xl"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <Icon className="w-6 h-6 lg:mr-4 relative z-10 mx-auto lg:mx-0" />
              <span className="hidden lg:block font-medium relative z-10">{item.label}</span>
              
              {/* Tooltip for collapsed state */}
              <div className="lg:hidden absolute left-full ml-4 px-2 py-1 bg-popover text-popover-foreground text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">
                {item.label}
              </div>
            </button>
          );
        })}
      </nav>

      <div className="mt-auto px-4 w-full space-y-2">
        <button className="w-full flex items-center p-3 rounded-xl text-muted-foreground hover:bg-secondary hover:text-foreground transition-all duration-200 group relative">
          <Settings className="w-6 h-6 lg:mr-4 mx-auto lg:mx-0" />
          <span className="hidden lg:block font-medium">Settings</span>
          <div className="lg:hidden absolute left-full ml-4 px-2 py-1 bg-popover text-popover-foreground text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">Settings</div>
        </button>
      </div>
    </aside>
  );
};
