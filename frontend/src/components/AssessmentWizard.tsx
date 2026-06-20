import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { ArrowRight, ArrowLeft, CheckCircle2, Car, Home, Utensils, Briefcase } from 'lucide-react';

const steps = [
  { id: 'transport', title: 'Transportation', icon: <Car size={20} /> },
  { id: 'energy', title: 'Home Energy', icon: <Home size={20} /> },
  { id: 'food', title: 'Diet & Lifestyle', icon: <Utensils size={20} /> },
  { id: 'work', title: 'Work Habits', icon: <Briefcase size={20} /> }
];

export const AssessmentWizard = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const { control, handleSubmit } = useForm({
    defaultValues: {
      vehicleType: 'gasoline',
      weeklyDistance: 100,
      flightsPerYear: 0,
      homeSize: 'medium',
      electricityUsage: 300,
      dietType: 'omnivore',
      workStyle: 'hybrid'
    }
  });

  const nextStep = () => {
    if (currentStep < steps.length - 1) setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(prev => prev - 1);
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      // Send data to our FastAPI backend
      const response = await fetch('http://localhost:8000/api/v1/assessments/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Device-Token': 'demo-user-123'
        },
        body: JSON.stringify(data)
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        console.error('Backend validation error:', result);
        alert('Failed to calculate! Check console for errors. Make sure backend is running.');
        return;
      }
      
      console.log('Assessment complete:', result);
      
      // Dispatch custom event to notify TrackingDashboard and AICoach to reload
      window.dispatchEvent(new Event('assessmentComplete'));
      
      alert('Impact calculated successfully! Scrolling to dashboard.');
      
      // Scroll to tracking dashboard to see results
      document.getElementById('track')?.scrollIntoView({ behavior: 'smooth' });
      
    } catch (error) {
      console.error('Failed to submit assessment:', error);
      alert('Failed to connect to backend. Make sure FastAPI is running on port 8000!');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="understand" className="py-24 bg-surface relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-[500px] bg-brand-blue/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-inter-tight mb-4">Understand Your Impact</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Complete this brief assessment to establish your baseline carbon footprint and receive personalized reduction strategies.
          </p>
        </div>

        <div className="glass-card p-8 md:p-12 rounded-3xl relative overflow-hidden">
          {/* Progress Indicator */}
          <div className="flex items-center justify-between mb-12 relative z-10">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-white/5 -z-10" />
            <div 
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-brand-emerald to-brand-blue -z-10 transition-all duration-500 ease-out" 
              style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }} 
            />
            {steps.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center gap-2">
                <div 
                  className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${
                    index <= currentStep 
                      ? 'bg-card border-brand-emerald text-brand-emerald shadow-[0_0_15px_rgba(0,229,138,0.3)]' 
                      : 'bg-bg-primary border-white/10 text-gray-500'
                  }`}
                >
                  {index < currentStep ? <CheckCircle2 size={24} /> : step.icon}
                </div>
                <span className={`text-xs font-medium hidden md:block ${index <= currentStep ? 'text-white' : 'text-gray-500'}`}>
                  {step.title}
                </span>
              </div>
            ))}
          </div>

          {/* Form Area */}
          <div className="min-h-[300px]">
            {/* Screen Reader Only Live Region for Step Changes */}
            <div aria-live="polite" className="sr-only">
              Step {currentStep + 1} of {steps.length}: {steps[currentStep].title}
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <form onSubmit={handleSubmit(onSubmit)}>
                  
                  {/* Step 1: Transport */}
                  {currentStep === 0 && (
                    <div className="space-y-6">
                      <h3 className="text-2xl font-bold font-inter-tight mb-6">Transportation Habits</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-300">Primary Vehicle Type</label>
                          <Controller
                            name="vehicleType"
                            control={control}
                            render={({ field }) => (
                              <select {...field} className="w-full bg-bg-primary border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-emerald focus:ring-1 focus:ring-brand-emerald transition-all">
                                <option value="gasoline">Gasoline/Diesel Car</option>
                                <option value="hybrid">Hybrid Vehicle</option>
                                <option value="ev">Electric Vehicle (EV)</option>
                                <option value="public">Public Transit Only</option>
                                <option value="bike">Bicycle / Walking</option>
                              </select>
                            )}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-300">Weekly Travel Distance (km)</label>
                          <Controller
                            name="weeklyDistance"
                            control={control}
                            render={({ field }) => (
                              <input type="number" {...field} className="w-full bg-bg-primary border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-emerald focus:ring-1 focus:ring-brand-emerald transition-all" />
                            )}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-300">Flights Per Year</label>
                          <Controller
                            name="flightsPerYear"
                            control={control}
                            render={({ field }) => (
                              <input type="number" {...field} className="w-full bg-bg-primary border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-emerald focus:ring-1 focus:ring-brand-emerald transition-all" />
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Energy */}
                  {currentStep === 1 && (
                    <div className="space-y-6">
                      <h3 className="text-2xl font-bold font-inter-tight mb-6">Home & Energy</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-300">Home Size</label>
                          <Controller
                            name="homeSize"
                            control={control}
                            render={({ field }) => (
                              <select {...field} className="w-full bg-bg-primary border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-emerald focus:ring-1 focus:ring-brand-emerald transition-all">
                                <option value="small">Small (Apartment/Condo)</option>
                                <option value="medium">Medium (Townhouse/Small House)</option>
                                <option value="large">Large (Detached House)</option>
                              </select>
                            )}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-300">Monthly Electricity Usage (kWh)</label>
                          <Controller
                            name="electricityUsage"
                            control={control}
                            render={({ field }) => (
                              <input type="number" {...field} className="w-full bg-bg-primary border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-emerald focus:ring-1 focus:ring-brand-emerald transition-all" />
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Diet */}
                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <h3 className="text-2xl font-bold font-inter-tight mb-6">Diet & Lifestyle</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-300">Diet Type</label>
                          <Controller
                            name="dietType"
                            control={control}
                            render={({ field }) => (
                              <select {...field} className="w-full bg-bg-primary border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-emerald focus:ring-1 focus:ring-brand-emerald transition-all">
                                <option value="meat-heavy">Meat-heavy (Every day)</option>
                                <option value="omnivore">Omnivore (Average)</option>
                                <option value="pescatarian">Pescatarian</option>
                                <option value="vegetarian">Vegetarian</option>
                                <option value="vegan">Vegan</option>
                              </select>
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 4: Work */}
                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <h3 className="text-2xl font-bold font-inter-tight mb-6">Work Habits</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-300">Work Style</label>
                          <Controller
                            name="workStyle"
                            control={control}
                            render={({ field }) => (
                              <select {...field} className="w-full bg-bg-primary border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-emerald focus:ring-1 focus:ring-brand-emerald transition-all">
                                <option value="office">Full-time Office</option>
                                <option value="hybrid">Hybrid</option>
                                <option value="remote">Fully Remote</option>
                              </select>
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="mt-12 flex items-center justify-between pt-6 border-t border-white/10">
                    <button
                      type="button"
                      onClick={prevStep}
                      disabled={currentStep === 0}
                      className={`px-6 py-3 rounded-full font-medium flex items-center gap-2 transition-all ${currentStep === 0 ? 'opacity-50 cursor-not-allowed text-gray-500' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}
                    >
                      <ArrowLeft size={18} /> Back
                    </button>
                    
                    {currentStep < steps.length - 1 ? (
                      <button
                        type="button"
                        onClick={nextStep}
                        className="bg-brand-blue hover:bg-brand-blue/90 text-bg-primary px-8 py-3 rounded-full font-semibold flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(59,164,255,0.2)]"
                      >
                        Continue <ArrowRight size={18} />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`bg-brand-emerald text-bg-primary px-8 py-3 rounded-full font-semibold flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(0,229,138,0.3)] ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-brand-emerald/90 cursor-pointer'}`}
                      >
                        {isSubmitting ? 'Calculating...' : 'Calculate Impact'} <CheckCircle2 size={18} />
                      </button>
                    )}
                  </div>
                </form>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};
