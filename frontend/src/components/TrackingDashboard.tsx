import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, PieChart, Pie, Cell
} from 'recharts';

const monthlyData = [
  { month: 'Jan', transport: 400, energy: 240, food: 150, goods: 100 },
  { month: 'Feb', transport: 300, energy: 220, food: 140, goods: 90 },
  { month: 'Mar', transport: 200, energy: 200, food: 140, goods: 80 },
  { month: 'Apr', transport: 278, energy: 190, food: 130, goods: 100 },
  { month: 'May', transport: 189, energy: 180, food: 130, goods: 80 },
  { month: 'Jun', transport: 239, energy: 180, food: 120, goods: 90 },
];

const categoryData = [
  { name: 'Transport', value: 45 },
  { name: 'Energy', value: 30 },
  { name: 'Food', value: 15 },
  { name: 'Goods', value: 10 },
];

const COLORS = ['#00E58A', '#3BA4FF', '#7B61FF', '#FFB84D'];

export const TrackingDashboard = () => {
  return (
    <section id="track" className="py-24 bg-bg-primary relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-4xl font-bold font-inter-tight mb-4">Tracking & Analytics</h2>
            <p className="text-gray-400 max-w-xl">
              Monitor your historical emissions and see how your lifestyle changes impact your overall carbon footprint.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <select className="bg-surface border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-brand-emerald">
              <option>Last 6 Months</option>
              <option>This Year</option>
              <option>All Time</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Trend Chart */}
          <div className="lg:col-span-2 glass-card p-6 md:p-8 rounded-3xl">
            <h3 className="text-xl font-bold font-inter-tight mb-6">Emissions Trend (kg CO₂e)</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTransport" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00E58A" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#00E58A" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorEnergy" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3BA4FF" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3BA4FF" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="month" stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#131F32', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="transport" stackId="1" stroke="#00E58A" strokeWidth={2} fill="url(#colorTransport)" />
                  <Area type="monotone" dataKey="energy" stackId="1" stroke="#3BA4FF" strokeWidth={2} fill="url(#colorEnergy)" />
                  <Area type="monotone" dataKey="food" stackId="1" stroke="#7B61FF" strokeWidth={2} fill="transparent" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="glass-card p-6 md:p-8 rounded-3xl flex flex-col">
            <h3 className="text-xl font-bold font-inter-tight mb-6">Category Breakdown</h3>
            <div className="flex-1 min-h-[250px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#131F32', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Central Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-bold font-inter-tight">850</span>
                <span className="text-xs text-gray-400">kg CO₂e avg</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-6">
              {categoryData.map((cat, i) => (
                <div key={cat.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  <span className="text-sm text-gray-300">{cat.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Comparison Cards */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">
            <ComparisonCard 
              title="vs Global Average" 
              value="-22%" 
              target="4,000 kg" 
              current="3,120 kg"
              isGood={true} 
            />
            <ComparisonCard 
              title="vs Paris Climate Target" 
              value="+18%" 
              target="2,000 kg" 
              current="2,360 kg"
              isGood={false} 
            />
            <ComparisonCard 
              title="Personal Best" 
              value="Jul 2025" 
              target="Month" 
              current="1,950 kg"
              isGood={true} 
            />
          </div>
        </div>
      </div>
    </section>
  );
};

const ComparisonCard = ({ title, value, target, current, isGood }: any) => (
  <div className="bg-surface/50 border border-white/5 p-6 rounded-2xl relative overflow-hidden">
    <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-[50px] ${isGood ? 'bg-brand-emerald/20' : 'bg-danger/20'}`} />
    <h4 className="text-sm font-medium text-gray-400 mb-2">{title}</h4>
    <div className="flex items-end gap-3 mb-4">
      <span className={`text-3xl font-bold font-inter-tight ${isGood ? 'text-brand-emerald' : 'text-danger'}`}>{value}</span>
    </div>
    <div className="flex items-center justify-between text-sm">
      <span className="text-gray-400">Current: <span className="text-white font-medium">{current}</span></span>
      <span className="text-gray-400">Target: <span className="text-white font-medium">{target}</span></span>
    </div>
  </div>
);
