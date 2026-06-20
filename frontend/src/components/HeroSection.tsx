import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Activity, TrendingDown, TreePine, LeafyGreen } from 'lucide-react';

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-1/4 -left-64 w-96 h-96 bg-brand-emerald/20 rounded-full blur-[128px]" />
      <div className="absolute bottom-1/4 -right-64 w-96 h-96 bg-brand-blue/20 rounded-full blur-[128px]" />

      <div className="max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-2 gap-12 items-center relative z-10">
        
        {/* Left Column: Copy */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-2xl"
        >
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
            Your Lifestyle Leaves A Footprint.<br />
            <span className="text-gradient">Planet Pulse Helps You Rewrite It.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 mb-10 leading-relaxed max-w-xl">
            Track emissions, understand environmental impact, and receive AI-powered recommendations personalized to your lifestyle.
          </p>
          
          <div className="flex flex-wrap items-center gap-4">
            <a href="#understand" className="bg-brand-emerald hover:bg-brand-emerald/90 text-bg-primary px-8 py-4 rounded-full font-semibold flex items-center gap-2 transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(0,229,138,0.3)] cursor-pointer">
              Start Assessment <ArrowRight size={20} />
            </a>
            <a href="#track" className="glass-card hover:bg-white/5 px-8 py-4 rounded-full font-semibold flex items-center gap-2 transition-all cursor-pointer">
              <Play size={20} /> View Demo
            </a>
          </div>
        </motion.div>

        {/* Right Column: Visuals */}
        <div className="relative h-[600px] w-full flex items-center justify-center">
          {/* Central animated globe representation */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
            className="absolute w-[400px] h-[400px] rounded-full border border-white/5 bg-gradient-to-br from-brand-emerald/5 to-brand-blue/5 backdrop-blur-3xl flex items-center justify-center shadow-2xl"
          >
             <div className="w-[300px] h-[300px] rounded-full border border-white/10 flex items-center justify-center">
                <div className="w-[200px] h-[200px] rounded-full border border-brand-emerald/20 border-dashed" style={{ animation: 'spin 20s linear infinite' }}></div>
             </div>
          </motion.div>

          {/* Floating Cards */}
          <FloatingCard 
            icon={<Activity className="text-brand-emerald" />}
            title="Carbon Score"
            value="84"
            subtitle="Top 15%"
            className="top-10 -left-10"
            delay={0}
          />
          <FloatingCard 
            icon={<TrendingDown className="text-brand-blue" />}
            title="CO₂ Saved"
            value="1.2t"
            subtitle="This Year"
            className="bottom-20 left-0"
            delay={0.2}
          />
          <FloatingCard 
            icon={<TreePine className="text-brand-emerald" />}
            title="Trees Eq."
            value="42"
            subtitle="Planted"
            className="top-32 -right-10"
            delay={0.4}
          />
          <FloatingCard 
            icon={<LeafyGreen className="text-brand-blue" />}
            title="Trend"
            value="-12%"
            subtitle="vs Last Month"
            className="bottom-32 right-0"
            delay={0.6}
          />
        </div>
      </div>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
};

interface FloatingCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle: string;
  className: string;
  delay: number;
}

const FloatingCard = ({ icon, title, value, subtitle, className, delay }: FloatingCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay, ease: "easeOut" }}
      className={`absolute glass-card p-4 rounded-2xl flex items-center gap-4 w-56 ${className}`}
      style={{ animation: `float 6s ease-in-out ${delay}s infinite alternate` }}
    >
      <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-400 font-medium">{title}</p>
        <div className="flex items-baseline gap-2">
          <p className="text-xl font-bold font-inter-tight">{value}</p>
          <p className="text-xs text-brand-emerald whitespace-nowrap">{subtitle}</p>
        </div>
      </div>
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          100% { transform: translateY(-20px); }
        }
      `}</style>
    </motion.div>
  );
};
