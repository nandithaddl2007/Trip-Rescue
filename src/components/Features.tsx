import React from 'react';
import { RefreshCw, AlertTriangle, Sliders, Layers, ArrowUpRight } from 'lucide-react';

export const Features: React.FC = () => {
  const features = [
    {
      title: 'Smart Recovery',
      description:
        'Rebuild your itinerary around disruptions automatically. The system factors in luggage claim, local transit, and venue check-in buffers.',
      icon: <RefreshCw className="w-5 h-5 text-[#D9826B]" />,
      highlight: 'Buffer-Aware Routing',
      bgCard: 'bg-[#FFF8F1]',
      borderCard: 'border-[#FDE8DC]',
      badgeBg: 'bg-[#FDE8DC] text-[#C97863]',
    },
    {
      title: 'Conflict Detection',
      description:
        'Identify activities and bookings affected by delays. Spot when a 6:00 PM check-in or 8:00 PM dinner reservation is at risk of being released.',
      icon: <AlertTriangle className="w-5 h-5 text-[#C97863]" />,
      highlight: 'Zero Lost Bookings',
      bgCard: 'bg-[#FFF8F1]',
      borderCard: 'border-[#F6D9DC]',
      badgeBg: 'bg-[#F6D9DC] text-[#3A3331]',
    },
    {
      title: 'Adaptive Planning',
      description:
        'Adjust the plan dynamically based on new timing. Smoothly reshuffle sequence orders without throwing away your entire trip agenda.',
      icon: <Sliders className="w-5 h-5 text-[#756B66]" />,
      highlight: 'Dynamic Rescheduling',
      bgCard: 'bg-[#FFF8F1]',
      borderCard: 'border-[#E9DDF2]',
      badgeBg: 'bg-[#E9DDF2] text-[#3A3331]',
    },
    {
      title: 'One Travel View',
      description:
        'Keep your recovery plan in one place. View old vs new times side-by-side, read AI recommendations, and export directly to your calendar.',
      icon: <Layers className="w-5 h-5 text-[#D9826B]" />,
      highlight: 'Unified Dashboard',
      bgCard: 'bg-[#FFF8F1]',
      borderCard: 'border-[#DCE8D5]',
      badgeBg: 'bg-[#DCE8D5] text-[#3A3331]',
    },
  ];

  return (
    <section id="features" className="py-20 bg-[#FDE8DC]/60 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-block px-3 py-1 rounded-full bg-[#FFF8F1] border border-[#FDE8DC] text-xs font-bold uppercase tracking-wider text-[#D9826B]">
            Core Recovery Capabilities
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#3A3331] tracking-tight">
            Designed for travel resilience
          </h2>
          <p className="text-[#756B66] text-sm sm:text-base">
            TripRescue AI isn't a generic chatbot—it's purpose-built travel recovery infrastructure.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat) => (
            <div
              key={feat.title}
              className={`p-6 sm:p-7 rounded-3xl ${feat.bgCard} ${feat.borderCard} border shadow-xs hover:shadow-md hover:border-[#D9826B] transition-all flex flex-col justify-between space-y-6`}
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-white border border-[#FDE8DC] shadow-2xs flex items-center justify-center">
                  {feat.icon}
                </div>

                <div className="space-y-2">
                  <div className={`inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${feat.badgeBg}`}>
                    {feat.highlight}
                  </div>
                  <h3 className="text-lg font-bold text-[#3A3331]">{feat.title}</h3>
                  <p className="text-xs sm:text-sm text-[#756B66] leading-relaxed">
                    {feat.description}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-[#FDE8DC] flex items-center justify-between text-xs text-[#756B66] font-medium">
                <span>Autonomous Assistant</span>
                <ArrowUpRight className="w-4 h-4 text-[#D9826B]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
