import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar, TrendingDown, Coins, Zap } from 'lucide-react';

const generatePredictionData = (months: number, current: number) => {
  const target = Math.max(0, current * 0.6); // Target a 40% reduction
  
  return Array.from({ length: months + 1 }).map((_, i) => {
    const projectedReduction = (current - target) * (i / 12) * 0.8; // Assume 80% success rate
    return {
      month: `Month ${i}`,
      baseline: current,
      projected: current - projectedReduction,
      savings: projectedReduction * 0.15 // $0.15 saved per kg reduced (hypothetical)
    };
  });
};

export const Predictor = () => {
  const [timeframe, setTimeframe] = useState<1 | 3 | 6 | 12>(6);
  const [currentEmissions, setCurrentEmissions] = useState(3120);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://planet-pulse-nutz.onrender.com'}/api/v1/assessments/history`, {
          headers: { 'X-Device-Token': 'demo-user-123' }
        });
        const result = await response.json();
        if (result.status === 'success' && result.history.length > 0) {
          const latest = result.history[0]; // the backend returns order by created_at DESC? 
          // Wait, TrackingDashboard reversed it. So history[0] is latest.
          setCurrentEmissions(latest.total_emissions || 3120);
        }
      } catch (err) {
        console.error("Failed to fetch tracking history for predictor", err);
      }
    };

    const handleRefresh = () => fetchHistory();
    window.addEventListener('assessmentComplete', handleRefresh);
    fetchHistory();
    return () => window.removeEventListener('assessmentComplete', handleRefresh);
  }, []);

  const data = generatePredictionData(timeframe, currentEmissions);
  const finalMonth = data[data.length - 1];

  return (
    <section id="predict" className="py-24 bg-bg-primary relative border-t border-white/5">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-blue/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-inter-tight mb-4">Future Impact Simulator</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Simulate your potential environmental and financial savings over time based on your current footprint of {currentEmissions} kg CO₂e.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Controls */}
          <div className="lg:col-span-1 space-y-6">
            <div className="glass-card p-6 rounded-2xl">
              <h3 className="font-bold font-inter-tight mb-4 flex items-center gap-2">
                <Calendar size={18} className="text-brand-blue" /> Timeframe
              </h3>
              <div className="space-y-3">
                {[1, 3, 6, 12].map((months) => (
                  <button
                    key={months}
                    onClick={() => setTimeframe(months as any)}
                    className={`w-full py-3 px-4 rounded-xl text-left text-sm font-medium transition-all flex items-center justify-between ${
                      timeframe === months 
                        ? 'bg-brand-blue text-bg-primary shadow-[0_0_15px_rgba(59,164,255,0.3)]' 
                        : 'bg-surface border border-white/10 text-gray-300 hover:border-white/30'
                    }`}
                  >
                    {months} Month{months > 1 ? 's' : ''}
                    {timeframe === months && <span className="w-2 h-2 rounded-full bg-bg-primary" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-4">
              <h3 className="font-bold font-inter-tight text-brand-emerald mb-2">Simulated Outcome</h3>
              
              <div className="flex justify-between items-end border-b border-white/10 pb-4">
                <div>
                  <p className="text-xs text-gray-400 mb-1">CO₂e Reduced</p>
                  <p className="text-2xl font-bold font-inter-tight flex items-center gap-2">
                    <TrendingDown size={20} className="text-brand-emerald" />
                    {(finalMonth.baseline - finalMonth.projected).toFixed(0)} kg
                  </p>
                </div>
              </div>
              
              <div className="flex justify-between items-end border-b border-white/10 pb-4">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Financial Savings</p>
                  <p className="text-2xl font-bold font-inter-tight flex items-center gap-2">
                    <Coins size={20} className="text-warning" />
                    ${(finalMonth.savings).toFixed(0)}
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Energy Saved</p>
                  <p className="text-2xl font-bold font-inter-tight flex items-center gap-2">
                    <Zap size={20} className="text-brand-blue" />
                    {((finalMonth.baseline - finalMonth.projected) * 0.8).toFixed(0)} kWh
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Chart Area */}
          <div className="lg:col-span-3 glass-card p-6 md:p-8 rounded-3xl flex flex-col min-h-[400px]">
            <h3 className="text-xl font-bold font-inter-tight mb-6 flex justify-between items-center">
              Emission Projection
              <span className="text-sm font-normal text-gray-400 bg-surface px-3 py-1 rounded-full border border-white/5">
                Baseline vs Projected
              </span>
            </h3>
            <div className="flex-1 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorProjected" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00E58A" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#00E58A" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="month" stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis domain={['auto', 'auto']} stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#131F32', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="baseline" stroke="rgba(255,255,255,0.2)" strokeDasharray="5 5" fill="none" strokeWidth={2} name="Baseline" />
                  <Area type="monotone" dataKey="projected" stroke="#00E58A" strokeWidth={3} fill="url(#colorProjected)" name="Projected Path" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
