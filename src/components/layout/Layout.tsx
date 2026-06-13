import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../lib/store';

interface LayoutProps {
  children: (activeTab: string) => React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [activeTab, setActiveTab] = useState('analyzer');
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div className={`flex h-screen w-full bg-background overflow-hidden ${isDarkMode ? 'dark' : ''}`}>
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-primary/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-purple-500/10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3 pointer-events-none" />
      
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 h-full overflow-y-auto relative z-10 px-4 py-8 lg:px-12 lg:py-10">
        <header className="w-full flex justify-end mb-8">
          <button 
            onClick={toggleTheme}
            className="p-3 rounded-full glass hover:bg-secondary transition-colors"
            aria-label="Toggle Theme"
          >
            {isDarkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
          </button>
        </header>
        
        <div className="max-w-7xl mx-auto h-full pb-20">
          {children(activeTab)}
        </div>
      </main>
    </div>
  );
};
