import React from 'react';
import { MessageSquareText, Cpu, CheckCircle2 } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'Tell us what happened',
      description:
        'Input your original route and describe the disruption naturally—whether your train is delayed 3 hours or a flight connection was cancelled.',
      icon: <MessageSquareText className="w-5 h-5 text-[#D9826B]" />,
      tag: 'Zero-Effort Input',
      accentBg: 'bg-[#FFF8F1]',
      borderAccent: 'border-[#FDE8DC]',
    },
    {
      number: '02',
      title: 'AI rebuilds your plan',
      description:
        'TripRescue evaluates your hotel check-in cutoffs, dinner reservations, transit transfers, and buffer margins to identify schedule clashes.',
      icon: <Cpu className="w-5 h-5 text-[#C97863]" />,
      tag: 'Conflict Intelligence',
      accentBg: 'bg-[#FFF8F1]',
      borderAccent: 'border-[#E9DDF2]',
    },
    {
      number: '03',
      title: 'Get a practical recovery itinerary',
      description:
        'Receive an optimized timeline, side-by-side time deltas, ready-to-send messages for front desks, and backup transit options.',
      icon: <CheckCircle2 className="w-5 h-5 text-[#D9826B]" />,
      tag: 'Actionable Recovery',
      accentBg: 'bg-[#FFF8F1]',
      borderAccent: 'border-[#DCE8D5]',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-[#FFF8F1] border-y border-[#FDE8DC] scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-block px-3 py-1 rounded-full bg-[#FDE8DC] text-xs font-bold uppercase tracking-wider text-[#C97863]">
            Engineered For Stressful Moments
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#3A3331] tracking-tight">
            How TripRescue AI Works
          </h2>
          <p className="text-[#756B66] text-sm sm:text-base">
            From travel disruption to a rebuilt, viable itinerary in three straightforward steps.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, idx) => {
            const stepImages = [
              'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&w=700&q=80',
              'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=700&q=80',
              'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=700&q=80',
            ];

            return (
              <div
                key={step.number}
                className="bg-white rounded-3xl border border-[#FDE8DC] shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md hover:border-[#D9826B]/50 transition-all duration-300"
              >
                {/* Visual Step Header Image with soft warm tint */}
                <div className="relative h-44 w-full overflow-hidden bg-[#FDE8DC]">
                  <img
                    src={stepImages[idx]}
                    alt={step.title}
                    className="w-full h-full object-cover filter brightness-[0.95] contrast-[1.03] hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#3A3331]/60 via-transparent to-transparent" />
                  <div className="absolute top-4 left-4 w-10 h-10 rounded-2xl bg-[#FFF8F1]/95 backdrop-blur-md shadow-sm flex items-center justify-center border border-[#FDE8DC]">
                    {step.icon}
                  </div>
                  <span className="absolute bottom-3 right-4 font-mono text-2xl font-black text-white/95 drop-shadow-sm">
                    {step.number}
                  </span>
                </div>

                <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2.5">
                    <div className="text-xs font-bold text-[#D9826B] uppercase tracking-wider">
                      {step.tag}
                    </div>
                    <h3 className="text-lg font-bold text-[#3A3331]">
                      {step.title}
                    </h3>
                    <p className="text-sm text-[#756B66] leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#FDE8DC] flex items-center text-xs font-medium text-[#756B66]">
                    <span>Phase {idx + 1} of 3</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
