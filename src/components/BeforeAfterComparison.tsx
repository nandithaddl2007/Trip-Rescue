import React from 'react';
import { TripDetails, DisruptionDetails, ItineraryItem, RescuePlan } from '../types/travel';
import { ArrowRight, ArrowDown, Clock, Hotel, Utensils, Ticket, Compass, Plane, Train, Sparkles } from 'lucide-react';

interface BeforeAfterComparisonProps {
  trip: TripDetails;
  disruption: DisruptionDetails;
  originalItems: ItineraryItem[];
  plan: RescuePlan;
}

export const BeforeAfterComparison: React.FC<BeforeAfterComparisonProps> = ({
  trip,
  originalItems,
  plan,
}) => {
  const getItemIcon = (type: string) => {
    switch (type) {
      case 'Hotel':
        return <Hotel className="w-4 h-4 text-[#C97863]" />;
      case 'Restaurant':
        return <Utensils className="w-4 h-4 text-[#D9826B]" />;
      case 'Event':
        return <Ticket className="w-4 h-4 text-[#756B66]" />;
      case 'Attraction':
        return <Compass className="w-4 h-4 text-[#756B66]" />;
      default:
        return <Clock className="w-4 h-4 text-[#756B66]" />;
    }
  };

  return (
    <section className="bg-[#FFF8F1] rounded-3xl p-6 sm:p-8 border border-[#FDE8DC] shadow-sm space-y-6">
      {/* Section Header */}
      <div className="text-left space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FDE8DC] text-[11px] font-bold uppercase tracking-wider text-[#C97863]">
          <Sparkles className="w-3.5 h-3.5 text-[#D9826B]" />
          <span>Before vs After</span>
        </div>
        <h3 className="text-2xl font-extrabold text-[#3A3331] tracking-tight">
          See how your trip changed
        </h3>
        <p className="text-sm text-[#756B66]">
          TripRescue compares your original plan with a practical recovery plan.
        </p>
      </div>

      {/* Side-by-Side on Desktop / Stacked with transition label on Mobile */}
      <div className="flex flex-col lg:flex-row items-stretch gap-6 relative">
        {/* Left Card: Original Plan */}
        <div className="flex-1 bg-[#F6D9DC]/35 border border-[#F6D9DC] rounded-2xl p-5 sm:p-6 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#F6D9DC]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#756B66]" />
              <h4 className="text-sm font-bold text-[#3A3331] uppercase tracking-wider">
                Original Plan
              </h4>
            </div>
            <span className="text-xs font-mono text-[#756B66]">Scheduled</span>
          </div>

          <div className="space-y-3">
            {/* Original Arrival Item */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/80 border border-[#FDE8DC] text-xs">
              <div className="flex items-center gap-2.5">
                {trip.transportType === 'Flight' ? (
                  <Plane className="w-4 h-4 text-[#756B66]" />
                ) : (
                  <Train className="w-4 h-4 text-[#756B66]" />
                )}
                <div>
                  <span className="font-bold text-[#3A3331]">
                    Arrive in {trip.destination}
                  </span>
                  <div className="text-[10px] text-[#756B66]">Initial timetable</div>
                </div>
              </div>
              <span className="font-mono font-bold text-[#756B66]">
                {trip.expectedArrivalTime || '4:00 PM'}
              </span>
            </div>

            {/* Original downstream itinerary items */}
            {originalItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-xl bg-white/80 border border-[#FDE8DC] text-xs"
              >
                <div className="flex items-center gap-2.5">
                  {getItemIcon(item.type)}
                  <div>
                    <span className="font-bold text-[#3A3331]">{item.activity}</span>
                    <div className="text-[10px] text-[#756B66]">{item.location || item.type}</div>
                  </div>
                </div>
                <span className="font-mono font-medium text-[#756B66]">{item.time}</span>
              </div>
            ))}
          </div>

          <div className="pt-2 text-[11px] text-[#756B66] border-t border-[#F6D9DC]/80">
            Original schedule prior to delay
          </div>
        </div>

        {/* Transition indicator (Desktop horizontal arrow / Mobile vertical badge) */}
        <div className="flex lg:flex-col items-center justify-center shrink-0 py-1">
          <div className="hidden lg:flex flex-col items-center gap-2 px-2 text-center">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#D9826B] bg-[#FFF8F1] px-2.5 py-1 rounded-full border border-[#FDE8DC] shadow-2xs whitespace-nowrap">
              Rebuilt
            </span>
            <div className="w-8 h-8 rounded-full bg-[#FDE8DC] flex items-center justify-center text-[#D9826B] shadow-2xs">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Mobile separator with transition label */}
          <div className="flex lg:hidden items-center justify-center gap-2 w-full py-1 text-center">
            <div className="h-px bg-[#FDE8DC] flex-1" />
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FDE8DC] border border-[#FDE8DC] text-xs font-bold text-[#D9826B] shadow-2xs">
              <span>TripRescue rebuilt your schedule</span>
              <ArrowDown className="w-3.5 h-3.5" />
            </div>
            <div className="h-px bg-[#FDE8DC] flex-1" />
          </div>
        </div>

        {/* Right Card: Rescue Plan */}
        <div className="flex-1 bg-[#DCE8D5]/35 border border-[#DCE8D5] rounded-2xl p-5 sm:p-6 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#DCE8D5]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D9826B]" />
              <h4 className="text-sm font-bold text-[#3A3331] uppercase tracking-wider">
                Rescue Plan
              </h4>
            </div>
            <span className="text-xs font-bold font-mono text-[#D9826B] bg-[#FFF8F1] px-2 py-0.5 rounded-md border border-[#DCE8D5]">
              Optimized & Viable
            </span>
          </div>

          <div className="space-y-3">
            {/* Updated Timeline Items from Rescue Plan */}
            {plan.updatedItinerary.map((event) => {
              const isChanged = event.originalTime && event.originalTime !== event.time;

              return (
                <div
                  key={event.id}
                  className={`flex items-center justify-between p-3 rounded-xl border text-xs transition-all ${
                    isChanged
                      ? 'bg-[#FFF8F1] border-[#D9826B]/50 shadow-2xs ring-1 ring-[#D9826B]/15'
                      : 'bg-white border-[#DCE8D5]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {getItemIcon(event.type)}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#3A3331]">{event.activity}</span>
                        {isChanged && (
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-[#FDE8DC] text-[#C97863]">
                            Adjusted
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-[#756B66]">
                        {event.location || event.type}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-mono font-bold text-[#3A3331]">{event.time}</div>
                    {isChanged && (
                      <div className="text-[10px] text-[#756B66] line-through font-mono">
                        Was {event.originalTime}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 flex items-center justify-between text-[11px] text-[#756B66] border-t border-[#DCE8D5]/80">
            <span className="font-semibold text-[#3A3331]">✓ Safe transit buffer included</span>
            <span className="font-mono text-[#D9826B]">Zero cancellations</span>
          </div>
        </div>
      </div>
    </section>
  );
};
