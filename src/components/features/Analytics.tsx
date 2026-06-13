import React from 'react';
import { GlassCard } from '../ui/GlassCard';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Shield, TrendingUp, Users } from 'lucide-react';

export const Analytics: React.FC = () => {
  
  // Dummy data for visual presentation of analytics
  const radarData = [
    { subject: 'Length', A: 120, fullMark: 150 },
    { subject: 'Complexity', A: 98, fullMark: 150 },
    { subject: 'Entropy', A: 86, fullMark: 150 },
    { subject: 'Unpredictability', A: 99, fullMark: 150 },
    { subject: 'Uniqueness', A: 85, fullMark: 150 },
    { subject: 'Structure', A: 65, fullMark: 150 },
  ];

  const distributionData = [
    { name: '<8 chars', users: 4000 },
    { name: '8-12 chars', users: 3000 },
    { name: '13-16 chars', users: 2000 },
    { name: '17+ chars', users: 1000 },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-foreground">Security Analytics</h2>
        <p className="text-muted-foreground mt-2">Global password statistics and visual benchmarks.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <GlassCard className="flex items-center p-6">
          <div className="p-4 rounded-xl bg-primary/10 text-primary mr-4">
            <Shield className="w-8 h-8" />
          </div>
          <div>
            <div className="text-2xl font-bold">42.8 bits</div>
            <div className="text-sm text-muted-foreground">Avg Global Entropy</div>
          </div>
        </GlassCard>
        <GlassCard className="flex items-center p-6">
          <div className="p-4 rounded-xl bg-purple-500/10 text-purple-500 mr-4">
            <TrendingUp className="w-8 h-8" />
          </div>
          <div>
            <div className="text-2xl font-bold">11.2 chars</div>
            <div className="text-sm text-muted-foreground">Avg Global Length</div>
          </div>
        </GlassCard>
        <GlassCard className="flex items-center p-6">
          <div className="p-4 rounded-xl bg-green-500/10 text-green-500 mr-4">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <div className="text-2xl font-bold">18%</div>
            <div className="text-sm text-muted-foreground">Use Password Managers</div>
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="min-h-[400px] flex flex-col">
          <h3 className="text-xl font-bold mb-6">Security Vectors</h3>
          <div className="flex-1 w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="var(--border)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                <Radar name="Ideal" dataKey="fullMark" stroke="var(--muted-foreground)" fill="var(--muted)" fillOpacity={0.1} />
                <Radar name="Current" dataKey="A" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.5} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard className="min-h-[400px] flex flex-col">
          <h3 className="text-xl font-bold mb-6">Length Distribution</h3>
          <div className="flex-1 w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={distributionData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: 'var(--secondary)' }}
                  contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px', color: 'var(--foreground)' }} 
                />
                <Bar dataKey="users" fill="var(--primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
