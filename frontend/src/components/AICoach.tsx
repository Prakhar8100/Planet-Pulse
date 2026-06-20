import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Zap, Target, TrainFront } from 'lucide-react';

export const AICoach = () => {
  return (
    <section id="coach" className="py-24 bg-surface relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-highlight/10 rounded-[100%] blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-highlight/20 text-highlight border border-highlight/30 mb-6 text-sm font-medium">
            <Sparkles size={16} /> Powered by Gemini AI
          </div>
          <h2 className="text-4xl md:text-5xl font-bold font-inter-tight mb-4">Your AI Climate Coach</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Based on your recent activity, here are personalized strategies to reduce your footprint and save money.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <CoachCard 
            delay={0}
            icon={<TrainFront size={24} className="text-brand-emerald" />}
            title="Optimize Commute"
            impact="240 kg CO₂e / yr"
            savings="$350 / yr"
            reasoning="You drive 100km weekly. Switching 2 weekly car trips to the metro can significantly cut emissions and save on gas and parking."
            tags={['High Impact', 'Transport']}
          />
          <CoachCard 
            delay={0.2}
            icon={<Zap size={24} className="text-brand-blue" />}
            title="Smart Heating"
            impact="180 kg CO₂e / yr"
            savings="$120 / yr"
            reasoning="Your winter gas usage is above average. Lowering your thermostat by 1°C while sleeping reduces energy consumption by 8%."
            tags={['Energy', 'Easy Win']}
          />
          <CoachCard 
            delay={0.4}
            icon={<Target size={24} className="text-highlight" />}
            title="Plant-Based Day"
            impact="110 kg CO₂e / yr"
            savings="$150 / yr"
            reasoning="Incorporating just one meatless day per week reduces agricultural emissions and often lowers weekly grocery bills."
            tags={['Diet', 'Health']}
          />
        </div>
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
