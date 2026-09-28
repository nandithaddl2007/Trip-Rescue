import React from 'react';
import { TripDetails, RescuePlan } from '../types/travel';
import {
  Train,
  Plane,
  Hotel,
  Utensils,
  MapPin,
  Calendar,
  Sparkles,
  Route,
  ChevronDown,
} from 'lucide-react';

interface JourneyMapSectionProps {
  trip: TripDetails;
  plan: RescuePlan;
}

export const JourneyMapSection: React.FC<JourneyMapSectionProps> = ({ trip, plan }) => {
  // Build clean visual stops list
  const stops = [
    {
      id: 'origin',
      title: trip.origin,
      subtitle: `${trip.transportType} Departure`,
      time: trip.departureTime || '05:30 AM',
      icon: trip.transportType === 'Flight' ? <Plane className="w-4 h-4 text-white" /> : <Train className="w-4 h-4 text-white" />,
      markerColor: 'bg-[#D9826B]',
      badge: 'Departure',
    },
    {
      id: 'arrival',
      title: trip.destination,
      subtitle: `Revised Arrival (${plan.tripStatus.delayDisplay} delayed)`,
      time: plan.tripStatus.newExpectedArrival,
      icon: <MapPin className="w-4 h-4 text-white" />,
      markerColor: 'bg-[#C97863]',
      badge: 'Arrival',
    },
    ...plan.updatedItinerary
      .filter((item) => item.status !== 'Arrival')
      .map((item) => {
        let icon = <Calendar className="w-4 h-4 text-white" />;
        let color = 'bg-[#756B66]';

        if (item.type === 'Hotel') {
          icon = <Hotel className="w-4 h-4 text-white" />;
          color = 'bg-[#C97863]';
        } else if (item.type === 'Restaurant') {
          icon = <Utensils className="w-4 h-4 text-white" />;
          color = 'bg-[#D9826B]';
        }

        return {
          id: item.id,
          title: item.activity,
          subtitle: item.location || item.type,
          time: item.time,
          icon,
          markerColor: color,
          badge: item.status,
        };
      }),
  ];

  return (
    <section className="bg-[#FFF8F1] rounded-3xl p-6 sm:p-8 border border-[#FDE8DC] shadow-sm space-y-6">
      {/* Section Header */}
      <div className="text-left space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FDE8DC] text-[11px] font-bold uppercase tracking-wider text-[#C97863]">
          <Route className="w-3.5 h-3.5 text-[#D9826B]" />
          <span>Journey Map</span>
        </div>
        <h3 className="text-2xl font-extrabold text-[#3A3331] tracking-tight">
          Your Journey
        </h3>
        <p className="text-sm text-[#756B66]">
          See how your updated plan flows from one stop to the next.
        </p>
      </div>

      {/* Visual Journey Track: Horizontal on large screens, vertical on mobile/tablets */}
      <div className="pt-2">
        {/* Desktop Flow (horizontal nodes with subtle dashed connection line) */}
        <div className="hidden lg:block relative py-6">
          {/* Subtle connected line */}
          <div className="absolute top-12 left-8 right-8 h-0.5 border-t-2 border-dashed border-[#FDE8DC] z-0" />

          <div
            className="grid gap-4 relative z-10"
            style={{
              gridTemplateColumns: `repeat(${Math.min(stops.length, 5)}, minmax(0, 1fr))`,
            }}
          >
            {stops.slice(0, 5).map((stop) => (
              <div key={stop.id} className="flex flex-col items-center text-center space-y-3">
                {/* Node Marker */}
                <div
                  className={`w-12 h-12 rounded-2xl ${stop.markerColor} flex items-center justify-center shadow-xs ring-4 ring-[#FFF8F1] transition-transform duration-300 hover:scale-105`}
                >
                  {stop.icon}
                </div>

                <div className="space-y-1 px-2">
                  <span className="inline-block font-mono text-xs font-bold text-[#D9826B] bg-[#FDE8DC] px-2 py-0.5 rounded-md">
                    {stop.time}
                  </span>
                  <h4 className="text-sm font-bold text-[#3A3331] leading-tight">
                    {stop.title}
                  </h4>
                  <p className="text-xs text-[#756B66]">{stop.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile & Tablet Flow (Clean vertical dashed line) */}
        <div className="lg:hidden relative pl-6 space-y-6 before:absolute before:left-3.5 before:top-4 before:bottom-4 before:w-0.5 before:border-l-2 before:border-dashed before:border-[#FDE8DC]">
          {stops.map((stop, idx) => (
            <div key={stop.id} className="relative flex items-start gap-4">
              {/* Vertical node pin */}
              <div
                className={`w-8 h-8 rounded-xl ${stop.markerColor} flex items-center justify-center shrink-0 shadow-2xs ring-4 ring-[#FFF8F1] mt-0.5`}
              >
                {stop.icon}
              </div>

              <div className="flex-1 bg-white p-3.5 rounded-2xl border border-[#FDE8DC] shadow-2xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#D9826B] bg-[#FFF8F1] px-2 py-0.5 rounded border border-[#FDE8DC]">
                    {stop.time}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-[#756B66] tracking-wider">
                    {stop.badge}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-[#3A3331]">{stop.title}</h4>
                <p className="text-xs text-[#756B66]">{stop.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
