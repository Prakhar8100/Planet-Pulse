import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Trophy, Footprints, Flame, Plus, Carrot } from 'lucide-react';

export const MissionSystem = () => {
  const [activeMissions, setActiveMissions] = useState<any[]>([]);
  const [ecoPoints, setEcoPoints] = useState(1240);
  const [level, setLevel] = useState("Level 4: Climate Advocate");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://planet-pulse-nutz.onrender.com'}/api/v1/assessments/history`, {
          headers: { 'X-Device-Token': 'demo-user-123' }
        });
        const result = await response.json();
        if (result.status === 'success' && result.history.length > 0) {
          const latest = result.history[0]; // most recent
          
          // Calculate Eco Points based on how many assessments they've done
          const newPoints = 1240 + (result.history.length * 50);
          setEcoPoints(newPoints);
          if (newPoints > 1500) setLevel("Level 5: Earth Guardian");

          // Dynamically set missions based on their worst categories
          const missions = [];
          
          if (latest.transport_emissions > 1000) {
            missions.push({ id: 1, title: 'Use public transport twice this week', progress: 0, total: 2, points: 50, icon: <Footprints /> });
          } else {
            missions.push({ id: 1, title: 'Maintain your low-carbon commute!', progress: 1, total: 1, points: 20, icon: <CheckCircle2 className="text-brand-emerald" />, completed: true });
          }

          if (latest.energy_emissions > 800) {
            missions.push({ id: 2, title: 'Reduce electricity consumption by 5%', progress: 0, total: 1, points: 120, icon: <Flame /> });
          } else {
            missions.push({ id: 2, title: 'Keep your thermostat optimized', progress: 1, total: 1, points: 30, icon: <CheckCircle2 className="text-brand-emerald" />, completed: true });
          }

          if (latest.food_emissions > 1500) {
            missions.push({ id: 3, title: 'Two vegetarian days this week', progress: 0, total: 2, points: 80, icon: <Carrot /> });
          } else {
            missions.push({ id: 3, title: 'Great job eating sustainably!', progress: 1, total: 1, points: 40, icon: <CheckCircle2 className="text-brand-emerald" />, completed: true });
          }

          setActiveMissions(missions);
        } else {
          // Fallback if no history
          setActiveMissions([
            { id: 1, title: 'Complete your first assessment', progress: 0, total: 1, points: 100, icon: <CheckCircle2 /> }
          ]);
        }
      } catch (err) {
        console.error("Failed to fetch tracking history for missions", err);
      }
    };

    const handleRefresh = () => fetchHistory();
    window.addEventListener('assessmentComplete', handleRefresh);
    fetchHistory();
    return () => window.removeEventListener('assessmentComplete', handleRefresh);
  }, []);

  return (
    <section id="reduce" className="py-24 bg-surface relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          <div className="lg:col-span-1">
            <h2 className="text-4xl font-bold font-inter-tight mb-4">Missions & Goals</h2>
            <p className="text-gray-400 mb-8">
              Turn your sustainability goals into actionable steps based on your latest footprint.
            </p>

            <div className="glass-card p-6 rounded-3xl relative overflow-hidden mb-6">
              <div className="absolute -right-6 -top-6 w-32 h-32 bg-warning/20 rounded-full blur-[40px]" />
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-warning/20 text-warning flex items-center justify-center">
                  <Trophy size={24} />
                </div>
                <div>
                  <p className="text-sm text-gray-400 font-medium">Eco Points</p>
                  <p className="text-3xl font-bold font-inter-tight text-white">{ecoPoints.toLocaleString()}</p>
                </div>
              </div>
              <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-warning to-brand-emerald w-3/4 h-full" />
              </div>
              <p className="text-xs text-gray-400 mt-2 text-right">{level}</p>
            </div>
            
            <button 
              onClick={() => alert('The Community Mission Marketplace is coming in v2.0! Keep completing your weekly assessments to earn more points.')}
              className="w-full py-4 rounded-2xl border border-dashed border-white/20 text-gray-400 hover:text-white hover:border-white/50 hover:bg-white/5 transition-colors flex items-center justify-center gap-2 font-medium cursor-pointer"
            >
              <Plus size={18} /> Browse New Missions
            </button>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xl font-bold font-inter-tight mb-6">Active Missions</h3>
            
            {activeMissions.map((mission, idx) => (
              <motion.div 
                key={mission.id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`glass-card p-6 rounded-2xl flex items-center gap-6 transition-all ${mission.completed ? 'border-brand-emerald/30 bg-brand-emerald/5' : 'border-white/5 hover:bg-card/80'}`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${mission.completed ? 'bg-brand-emerald/20 text-brand-emerald' : 'bg-surface text-gray-400'}`}>
                  {mission.icon}
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className={`font-bold font-inter-tight ${mission.completed ? 'text-white' : 'text-gray-200'}`}>
                      {mission.title}
                    </h4>
                    <span className="text-xs font-bold text-warning bg-warning/10 px-2 py-1 rounded-md shrink-0">
                      +{mission.points} pts
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex-1 bg-surface h-1.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${mission.completed ? 'bg-brand-emerald' : 'bg-brand-blue'}`}
                        style={{ width: `${(mission.progress / mission.total) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-gray-400 whitespace-nowrap">
                      {mission.progress} / {mission.total}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};
