/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { TripForm } from './components/TripForm';
import { LoadingState } from './components/LoadingState';
import { ResultsDashboard } from './components/ResultsDashboard';
import { HowItWorks } from './components/HowItWorks';
import { Features } from './components/Features';
import { Footer } from './components/Footer';
import { N8nChatbot } from './components/N8nChatbot';
import { PRESET_DEMOS } from './data/presetTrips';
import { TripDetails, DisruptionDetails, ItineraryItem, RescuePlan } from './types/travel';
import { buildRecoveryPlanHeuristic } from './services/recoveryEngine';

export default function App() {
  const defaultDemo = PRESET_DEMOS[0]; // Visakhapatnam -> Hyderabad

  const [trip, setTrip] = useState<TripDetails>(defaultDemo.trip);
  const [disruption, setDisruption] = useState<DisruptionDetails>(defaultDemo.disruption);
  const [items, setItems] = useState<ItineraryItem[]>(defaultDemo.items);
  const [activePresetId, setActivePresetId] = useState<string | null>(defaultDemo.id);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [rescuePlan, setRescuePlan] = useState<RescuePlan | null>(null);

  const formRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleSelectPreset = (presetId: string) => {
    const found = PRESET_DEMOS.find((d) => d.id === presetId);
    if (found) {
      setTrip(found.trip);
      setDisruption(found.disruption);
      setItems(found.items);
      setActivePresetId(found.id);
      setRescuePlan(null); // Reset results so user sees the new form
    }
  };

  const handleRescue = async () => {
    setIsLoading(true);
    setRescuePlan(null);

    // Smooth scroll to form area
    formRef.current?.scrollIntoView({ behavior: 'smooth' });

    const startTime = Date.now();

    try {
      // Call server-side API (which connects to Gemini 3.8 Flash)
      const res = await fetch('/api/rescue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trip, disruption, items }),
      });

      let planData: RescuePlan;
      if (res.ok) {
        planData = await res.json();
      } else {
        // Fallback to client heuristic engine if server is unreachable
        planData = buildRecoveryPlanHeuristic(trip, disruption, items);
      }

      // Enforce the brief's instruction:
      // "Do not make the loading state instantaneous. Simulate a short processing experience."
      const elapsedTime = Date.now() - startTime;
      const minDelay = 2200; // ~2.2 seconds for realistic analysis simulation
      if (elapsedTime < minDelay) {
        await new Promise((resolve) => setTimeout(resolve, minDelay - elapsedTime));
      }

      setRescuePlan(planData);
    } catch (err) {
      console.warn('Network issue calling /api/rescue, running local heuristic engine:', err);
      // Guarantee flawless recovery execution in any offline or restricted environment
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const fallbackPlan = buildRecoveryPlanHeuristic(trip, disruption, items);
      setRescuePlan(fallbackPlan);
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToHowItWorks = () => {
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        onRescueClick={scrollToForm}
        onHowItWorksClick={scrollToHowItWorks}
        onFeaturesClick={scrollToFeatures}
        onLoadDemo={() => {
          handleSelectPreset('vizag-hyderabad');
          scrollToForm();
        }}
      />

      {/* Main Landing Hero */}
      <Hero
        onRescueClick={scrollToForm}
        onHowItWorksClick={scrollToHowItWorks}
        onLoadDemo={() => {
          handleSelectPreset('vizag-hyderabad');
          scrollToForm();
        }}
      />

      {/* Main Interactive Studio Area - Pastel Sage Container */}
      <section className="bg-[#DCE8D5]/40 border-y border-[#DCE8D5] py-14 sm:py-20">
        <main className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-12">
          {/* Anchor for form */}
          <div ref={formRef}>
            <TripForm
              trip={trip}
              setTrip={setTrip}
              disruption={disruption}
              setDisruption={setDisruption}
              items={items}
              setItems={setItems}
              onRescue={handleRescue}
              isLoading={isLoading}
              onSelectPreset={handleSelectPreset}
              activePresetId={activePresetId}
            />
          </div>

          {/* Loading State Animation */}
          {isLoading && <LoadingState />}

          {/* Rescue Results Dashboard */}
          {rescuePlan && !isLoading && (
            <div ref={resultsRef} className="pt-6 animate-in fade-in duration-500">
              <ResultsDashboard
                plan={rescuePlan}
                trip={trip}
                disruption={disruption}
                originalItems={items}
                onModifySearch={scrollToForm}
              />
            </div>
          )}
        </main>
      </section>

      {/* How It Works Section */}
      <HowItWorks />

      {/* Features Section */}
      <Features />

      {/* Footer */}
      <Footer
        onRescueClick={scrollToForm}
        onHowItWorksClick={scrollToHowItWorks}
        onFeaturesClick={scrollToFeatures}
        onLoadDemo={() => {
          handleSelectPreset('vizag-hyderabad');
          scrollToForm();
        }}
      />

      {/* Floating n8n AI Chatbot Agent */}
      <N8nChatbot />
    </div>
  );
}
