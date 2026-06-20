import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Zap, Target, TrainFront, Loader2 } from 'lucide-react';

export const AICoach = () => {
  const [insights, setInsights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://planet-pulse-nutz.onrender.com'}/api/v1/insights/coach`, {
          headers: {
            'X-Device-Token': 'demo-user-123'
          }
        });
        const result = await response.json();
        if (result.status === 'success') {
          setInsights(result.recommendations || []);
        }
      } catch (err) {
        console.error("Failed to fetch AI insights", err);
      } finally {
        setLoading(false);
      }
    };

    // Listen for custom event when assessment completes to refresh data
    const handleRefresh = () => fetchInsights();
    window.addEventListener('assessmentComplete', handleRefresh);
    
    fetchInsights();
    return () => window.removeEventListener('assessmentComplete', handleRefresh);
  }, []);

  // Simple icon mapping based on tags
  const getIcon = (tags: string[]) => {
    if (tags.includes('Transport')) return <TrainFront size={24} className="text-brand-emerald" />;
    if (tags.includes('Diet')) return <Target size={24} className="text-highlight" />;
    return <Zap size={24} className="text-brand-blue" />;
  };

  return (
    <section id="coach" className="py-24 bg-surface relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-highlight/10 rounded-[100%] blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-highlight/20 text-highlight border border-highlight/30 mb-6 text-sm font-medium">
            <Sparkles size={16} /> Powered by DeepSeek AI (OpenRouter)
          </div>
          <h2 className="text-4xl md:text-5xl font-bold font-inter-tight mb-4">Your AI Climate Coach</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Based on your recent activity, here are personalized strategies to reduce your footprint and save money.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400 space-y-4">
            <Loader2 size={32} className="animate-spin text-highlight" />
            <p>Analyzing your data to generate personalized insights...</p>
          </div>
        ) : insights.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            No insights available yet. Complete an assessment to get started!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {insights.map((insight, index) => (
              <CoachCard 
                key={index}
                delay={index * 0.2}
                icon={getIcon(insight.tags || [])}
                title={insight.title}
                impact={insight.impact}
                savings={insight.savings}
                reasoning={insight.reasoning}
                tags={insight.tags || []}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

const CoachCard = ({ delay, icon, title, impact, savings, reasoning, tags }: any) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay }}
      className="glass-card rounded-3xl p-8 flex flex-col h-full hover:bg-card/80 transition-colors border-white/5 hover:border-white/20"
    >
      <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-2xl font-bold font-inter-tight mb-4">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-1">
        {reasoning}
      </p>
      
      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Emission Reduction</span>
          <span className="text-brand-emerald font-semibold font-inter-tight">{impact}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Estimated Savings</span>
          <span className="text-brand-blue font-semibold font-inter-tight">{savings}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-6">
        {tags.map((tag: string) => (
          <span key={tag} className="px-3 py-1 rounded-full bg-white/5 text-xs font-medium text-gray-300">
            {tag}
          </span>
        ))}
      </div>

      <button onClick={() => alert('Strategy adopted! +50 Eco Points.')} className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 font-medium transition-colors flex items-center justify-center gap-2 mt-auto cursor-pointer">
        Adopt Strategy <ArrowRight size={16} />
      </button>
    </motion.div>
  );
};
