import React from 'react';
import { Leaf, UserCircle } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';

export const Header = () => {
  const { openAuthModal, user } = useAuthStore();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-bg-primary/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer">
          <img src="/logo.png" alt="Planet Pulse Logo" className="w-10 h-10 object-contain rounded-full border border-white/10 bg-black/50 p-1" />
          <span className="text-xl font-bold font-inter-tight tracking-tight">Planet Pulse</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
          <a href="#understand" className="hover:text-white transition-colors">Understand</a>
          <a href="#track" className="hover:text-white transition-colors">Track</a>
          <a href="#act" className="hover:text-white transition-colors">Act</a>
          <a href="#predict" className="hover:text-white transition-colors">Predict</a>
        </nav>
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-300">
                <UserCircle size={20} className="text-brand-emerald" />
                <span className="hidden sm:inline">{user.email}</span>
              </div>
              <button 
                onClick={handleSignOut} 
                className="text-sm font-medium text-red-400 hover:text-red-300 transition-colors cursor-pointer bg-red-500/10 px-4 py-2 rounded-full"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <>
              <button onClick={openAuthModal} aria-label="Log in to your account" className="text-sm font-medium text-gray-300 hover:text-white transition-colors cursor-pointer">Log in</button>
              <button onClick={openAuthModal} aria-label="Get started with Planet Pulse" className="bg-white text-bg-primary px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-gray-200 transition-colors cursor-pointer">
                Get Started
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
