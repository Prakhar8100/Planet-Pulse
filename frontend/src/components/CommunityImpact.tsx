import React from 'react';
import { motion } from 'framer-motion';
import { Users, Globe2, Target, Trophy } from 'lucide-react';

export const CommunityImpact = () => {
  return (
    <section className="py-24 bg-bg-primary relative border-t border-white/5 overflow-hidden">
      {/* Background World Map or abstract pattern could go here */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-emerald/20 via-bg-primary to-bg-primary" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-inter-tight mb-4">Global Impact</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Join thousands of others making measurable environmental improvements together.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard icon={<Users className="text-brand-blue" />} value="50,000+" label="Users Analyzed" delay={0} />
          <StatCard icon={<Globe2 className="text-brand-emerald" />} value="5M+" label="kg CO₂ Tracked" delay={0.1} />
          <StatCard icon={<Trophy className="text-warning" />} value="1.2M+" label="Eco Points Earned" delay={0.2} />
          <StatCard icon={<Target className="text-highlight" />} value="250k+" label="Missions Completed" delay={0.3} />
        </div>
      </div>
    </section>
  );
};

const StatCard = ({ icon, value, label, delay }: any) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="glass-card p-8 rounded-3xl text-center hover:-translate-y-2 transition-transform duration-300"
    >
      <div className="w-16 h-16 mx-auto rounded-full bg-white/5 flex items-center justify-center mb-6">
        {icon}
      </div>
      <h4 className="text-4xl font-bold font-inter-tight mb-2 text-white">{value}</h4>
      <p className="text-sm font-medium text-gray-400">{label}</p>
    </motion.div>
  );
};
