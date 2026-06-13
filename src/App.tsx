import React from 'react';
import { Layout } from './components/layout/Layout';
import { Analyzer } from './components/features/Analyzer';
import { Generator } from './components/features/Generator';
import { Simulator } from './components/features/Simulator';
import { Analytics } from './components/features/Analytics';

function App() {
  const renderContent = (activeTab: string) => {
    switch (activeTab) {
      case 'analyzer':
        return <Analyzer />;
      case 'generator':
        return <Generator />;
      case 'simulator':
        return <Simulator />;
      case 'analytics':
        return <Analytics />;
      default:
        return <Analyzer />;
    }
  };

  return (
    <Layout>
      {(activeTab) => renderContent(activeTab)}
    </Layout>
  );
}

export default App;
