import React, { useEffect } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { AssessmentWizard } from './components/AssessmentWizard';
import { TrackingDashboard } from './components/TrackingDashboard';
import { AICoach } from './components/AICoach';
import { Predictor } from './components/Predictor';
import { MissionSystem } from './components/MissionSystem';
import { CommunityImpact } from './components/CommunityImpact';
import { AuthModal } from './components/AuthModal';
import { supabase } from './lib/supabase';
import { useAuthStore } from './store/authStore';

function App() {
  const { setSession } = useAuthStore();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, [setSession]);

  return (
    <div className="min-h-screen bg-bg-primary text-white selection:bg-brand-emerald/30 selection:text-white font-inter">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-brand-blue text-bg-primary px-4 py-2 z-[100] rounded-md font-bold">
        Skip to main content
      </a>
      <Header />
      
      <main id="main-content" tabIndex={-1} className="outline-none">
        <HeroSection />
        <AssessmentWizard />
        <TrackingDashboard />
        <AICoach />
        <Predictor />
        <MissionSystem />
        <CommunityImpact />
      </main>
      
      <footer className="py-8 border-t border-white/10 text-center text-sm text-gray-500">
        <p>© 2026 Planet Pulse. All rights reserved.</p>
      </footer>

      <AuthModal />
    </div>
  );
}

export default App;
