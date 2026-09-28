import React, { useState } from 'react';
import {
  RescuePlan,
  TripDetails,
  DisruptionDetails,
  ItineraryItem,
} from '../types/travel';
import {
  Clock,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Calendar,
  MapPin,
  Hotel,
  Utensils,
  Ticket,
  Compass,
  Train,
  Plane,
  Share2,
  Info,
  Sparkles,
  ChevronRight,
  SlidersHorizontal,
} from 'lucide-react';
import { ActionModals, ActiveModalType } from './ActionModals';
import { BeforeAfterComparison } from './BeforeAfterComparison';
import { JourneyMapSection } from './JourneyMapSection';

interface ResultsDashboardProps {
  plan: RescuePlan;
  trip: TripDetails;
  disruption: DisruptionDetails;
  originalItems?: ItineraryItem[];
  onModifySearch: () => void;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({
  plan,
  trip,
  disruption,
  originalItems = [],
  onModifySearch,
}) => {
  const [activeModal, setActiveModal] = useState<ActiveModalType>(null);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'Hotel':
        return <Hotel className="w-4 h-4" />;
      case 'Restaurant':
        return <Utensils className="w-4 h-4" />;
      case 'Event':
        return <Ticket className="w-4 h-4" />;
      case 'Attraction':
        return <Compass className="w-4 h-4" />;
      case 'Transport':
        return trip.transportType === 'Flight' ? <Plane className="w-4 h-4" /> : <Train className="w-4 h-4" />;
      default:
        return <Compass className="w-4 h-4" />;
    }
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'Arrival':
        return 'bg-[#FDE8DC] text-[#D9826B] border-[#FDE8DC] font-bold';
      case 'Rescheduled':
        return 'bg-[#E9DDF2] text-[#3A3331] border-[#E9DDF2] font-bold';
      case 'Tight Connection':
        return 'bg-[#F6D9DC] text-[#C97863] border-[#F6D9DC] font-bold';
      case 'Preserved':
        return 'bg-[#DCE8D5] text-[#3A3331] border-[#DCE8D5] font-bold';
      default:
        return 'bg-[#FFF8F1] text-[#756B66] border-[#FDE8DC] font-bold';
    }
  };

  return (
    <div id="recovery-results" className="max-w-5xl mx-auto space-y-10 scroll-mt-20">
      {/* Top Banner: Product Rule & Integrity Standard in Warm Ivory/Peach Palette */}
      <div className="bg-[#FFF8F1] text-[#3A3331] rounded-3xl p-5 border border-[#FDE8DC] shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 text-xs text-[#756B66]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D9826B]" />
            <span className="font-bold text-[#3A3331]">Product Transparency Standard:</span>
            <span>
              Recommendations below are <strong className="text-[#D9826B]">AI-generated suggestions</strong>. No real bookings or cancellations were executed.
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs shrink-0">
            <button
              onClick={onModifySearch}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white hover:bg-[#FDE8DC] text-[#3A3331] border border-[#FDE8DC] font-semibold transition-colors cursor-pointer shadow-2xs"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#D9826B]" />
              <span>Edit Trip Details</span>
            </button>
          </div>
        </div>

        {/* 3-tier Legend */}
        <div className="mt-3 pt-3 border-t border-[#FDE8DC] grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-[#756B66]">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#756B66]" />
            <span>1. User-Provided Data: {trip.origin} → {trip.destination}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#D9826B]" />
            <span>2. AI Recommendation: Re-sequenced timeline</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#C97863]" />
            <span>3. Integrations: Draft ready / API sync coming soon</span>
          </div>
        </div>
      </div>

      {/* 1. TRIP STATUS CARD */}
      <div className="bg-[#FFF8F1] rounded-3xl p-6 sm:p-8 border border-[#FDE8DC] shadow-sm relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#FDE8DC]">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D9826B] mb-1">
              <span>Trip Recovery Status</span>
              <span className="text-[#756B66]/40">·</span>
              <span className="text-[#756B66] font-mono">
                {plan.aiRecommendation.source === 'gemini-ai' ? 'Powered by Gemini AI' : 'Smart Logistics Engine'}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#3A3331] tracking-tight">
              {trip.origin} to {trip.destination}
            </h2>
            <p className="text-sm text-[#756B66] mt-1">
              {trip.transportType} {trip.carrierOrNumber ? `· ${trip.carrierOrNumber}` : ''} · {trip.travelDate}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase ${
                plan.tripStatus.severity === 'severe'
                  ? 'bg-[#F6D9DC] text-[#3A3331] border border-[#F6D9DC]'
                  : 'bg-[#FDE8DC] text-[#C97863] border border-[#FDE8DC]'
              }`}
            >
              {plan.tripStatus.delayDisplay} Delay Detected
            </span>
          </div>
        </div>

        {/* Status Metrics Triad */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-[#FDE8DC] shadow-2xs">
            <span className="text-xs font-bold text-[#756B66] uppercase tracking-wider block">
              Original Arrival
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold font-mono text-[#756B66] line-through">
                {plan.tripStatus.originalArrival}
              </span>
            </div>
            <span className="text-xs text-[#756B66]/80 mt-1 block">Scheduled ticket ETA</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#FDE8DC]/70 border border-[#FDE8DC]">
            <span className="text-xs font-bold text-[#C97863] uppercase tracking-wider block">
              New Expected Arrival
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold font-mono text-[#D9826B]">
                {plan.tripStatus.newExpectedArrival}
              </span>
            </div>
            <span className="text-xs text-[#756B66] mt-1 block">
              Delayed by {plan.tripStatus.delayDisplay}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#DCE8D5]/70 border border-[#DCE8D5]">
            <span className="text-xs font-bold text-[#3A3331] uppercase tracking-wider block">
              Recovery Feasibility
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-[#3A3331]">100% Intact</span>
            </div>
            <span className="text-xs text-[#756B66] mt-1 block">All bookings rescheduled & saved</span>
          </div>
        </div>

        {/* Headline explanation */}
        <div className="mt-5 p-4 rounded-2xl bg-[#FDE8DC]/50 border border-[#FDE8DC] flex items-start gap-3">
          <Info className="w-5 h-5 text-[#D9826B] shrink-0 mt-0.5" />
          <p className="text-xs sm:text-sm text-[#3A3331] leading-relaxed font-medium">
            {plan.tripStatus.headline}
          </p>
        </div>
      </div>

      {/* 2. BEFORE VS AFTER COMPARISON */}
      <BeforeAfterComparison
        trip={trip}
        disruption={disruption}
        originalItems={originalItems}
        plan={plan}
      />

      {/* 3. MAP-STYLE JOURNEY SECTION */}
      <JourneyMapSection trip={trip} plan={plan} />

      {/* 4. CONFLICTS DETECTED SECTION */}
      {plan.conflictsDetected.length > 0 && (
        <div className="bg-[#FFF8F1] rounded-3xl p-6 sm:p-8 border border-[#FDE8DC] shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-[#FDE8DC]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#F6D9DC] text-[#C97863] flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#3A3331]">Conflicts Detected</h3>
                <p className="text-xs text-[#756B66]">Items directly threatened by the delayed arrival</p>
              </div>
            </div>
            <span className="text-xs font-mono text-[#C97863] bg-[#FDE8DC] px-2.5 py-1 rounded-md border border-[#FDE8DC] font-bold">
              {plan.conflictsDetected.length} Warning{plan.conflictsDetected.length > 1 ? 's' : ''}
            </span>
          </div>

          <div className="space-y-3">
            {plan.conflictsDetected.map((conflict) => (
              <div
                key={conflict.id}
                className="p-4 rounded-2xl bg-[#F6D9DC]/40 border border-[#F6D9DC] space-y-2 text-[#3A3331]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-base">⚠️</span>
                    <h4 className="font-bold text-sm text-[#3A3331]">{conflict.title}</h4>
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#FDE8DC] text-[#C97863]">
                    Action Recommended
                  </span>
                </div>

                <p className="text-xs text-[#756B66] pl-6 leading-relaxed">
                  {conflict.description}
                </p>

                <div className="pl-6 pt-1 text-xs font-medium text-[#3A3331] flex items-center gap-1.5">
                  <span className="font-bold text-[#D9826B]">Recommended Solution:</span>
                  <span>{conflict.suggestedResolution}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. WHAT CHANGED (OLD VS NEW TIMES) */}
      <div className="bg-[#FFF8F1] rounded-3xl p-6 sm:p-8 border border-[#FDE8DC] shadow-sm space-y-5">
        <div className="flex items-center justify-between pb-4 border-b border-[#FDE8DC]">
          <div>
            <h3 className="text-lg font-bold text-[#3A3331]">What Changed</h3>
            <p className="text-xs text-[#756B66]">Side-by-side comparison of original vs revised schedule</p>
          </div>
          <span className="text-xs text-[#756B66]">Clear adjustments breakdown</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {plan.whatChanged.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-white border border-[#FDE8DC] flex flex-col justify-between space-y-3 hover:border-[#D9826B]/50 transition-colors shadow-2xs"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="font-bold text-sm text-[#3A3331]">{item.activity}</span>
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                    item.impact === 'delayed'
                      ? 'bg-[#FDE8DC] text-[#C97863]'
                      : item.impact === 'rescheduled'
                      ? 'bg-[#E9DDF2] text-[#3A3331]'
                      : 'bg-[#DCE8D5] text-[#3A3331]'
                  }`}
                >
                  {item.impact}
                </span>
              </div>

              {/* Old vs New visual comparison */}
              <div className="flex items-center justify-between bg-[#FFF8F1] rounded-xl p-3 border border-[#FDE8DC] font-mono text-xs">
                <div>
                  <div className="text-[10px] uppercase font-sans text-[#756B66] font-semibold">Original</div>
                  <div className="text-[#756B66] line-through font-bold mt-0.5">{item.originalTime}</div>
                </div>

                <ArrowRight className="w-4 h-4 text-[#D9826B]" />

                <div className="text-right">
                  <div className="text-[10px] uppercase font-sans text-[#D9826B] font-bold">Updated</div>
                  <div className="text-[#3A3331] font-extrabold text-sm mt-0.5">{item.newTime}</div>
                </div>
              </div>

              <p className="text-xs text-[#756B66] leading-relaxed">
                {item.changeSummary}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 4. UPDATED ITINERARY (VISUAL TIMELINE) */}
      <div className="bg-[#FFF8F1] rounded-3xl p-6 sm:p-8 border border-[#FDE8DC] shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#FDE8DC] gap-2">
          <div>
            <h3 className="text-lg font-bold text-[#3A3331]">Updated Itinerary</h3>
            <p className="text-xs text-[#756B66]">Your reconstructed timeline with realistic transit buffers</p>
          </div>
          <span className="text-xs font-mono text-[#3A3331] bg-[#DCE8D5] px-2.5 py-1 rounded-md border border-[#DCE8D5] font-bold self-start sm:self-auto">
            ✓ Practical Sequence Confirmed
          </span>
        </div>

        {/* Visual Timeline */}
        <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-2.5 sm:before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#FDE8DC]">
          {plan.updatedItinerary.map((event) => {
            const isArrival = event.status === 'Arrival';
            const isRescheduled = event.status === 'Rescheduled';

            return (
              <div key={event.id} className="relative group">
                {/* Node pin */}
                <div
                  className={`absolute -left-6 sm:-left-8 top-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-transform group-hover:scale-110 ${
                    isArrival
                      ? 'bg-[#D9826B] border-white text-white shadow-2xs ring-2 ring-[#D9826B]/30'
                      : isRescheduled
                      ? 'bg-[#C97863] border-white text-white shadow-2xs ring-2 ring-[#C97863]/30'
                      : 'bg-[#DCE8D5] border-[#3A3331] text-[#3A3331] shadow-2xs'
                  }`}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                </div>

                {/* Timeline Card */}
                <div className="bg-white hover:bg-[#FFF8F1] rounded-2xl p-4 sm:p-5 border border-[#FDE8DC] hover:border-[#D9826B] hover:shadow-sm transition-all space-y-2.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm sm:text-base font-extrabold text-[#3A3331] bg-[#FFF8F1] px-2.5 py-0.5 rounded-lg border border-[#FDE8DC] shadow-2xs">
                        {event.time}
                      </span>
                      <span className="text-[#756B66] font-light">→</span>
                      <h4 className="text-base font-bold text-[#3A3331]">{event.activity}</h4>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      {event.originalTime && event.originalTime !== event.time && (
                        <span className="text-xs text-[#756B66] line-through font-mono">
                          Was {event.originalTime}
                        </span>
                      )}
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-md border uppercase tracking-wider ${getStatusBadgeStyle(
                          event.status
                        )}`}
                      >
                        {event.status}
                      </span>
                    </div>
                  </div>

                  {event.location && (
                    <div className="flex items-center gap-1.5 text-xs text-[#756B66]">
                      <MapPin className="w-3.5 h-3.5 text-[#D9826B]" />
                      <span className="font-medium text-[#3A3331]">{event.location}</span>
                      <span className="text-[#FDE8DC]">·</span>
                      <span className="text-[#756B66]">{event.type}</span>
                    </div>
                  )}

                  {event.actionableTip && (
                    <div className="pt-2 border-t border-[#FDE8DC] flex items-center justify-between">
                      <span className="text-xs text-[#C97863] font-bold">
                        💡 Tip: {event.actionableTip}
                      </span>
                      {event.type === 'Hotel' && (
                        <button
                          type="button"
                          onClick={() => setActiveModal('hotel')}
                          className="text-xs font-bold text-[#D9826B] hover:text-[#C97863] underline cursor-pointer"
                        >
                          Draft Notice
                        </button>
                      )}
                      {event.type === 'Restaurant' && (
                        <button
                          type="button"
                          onClick={() => setActiveModal('restaurant')}
                          className="text-xs font-bold text-[#D9826B] hover:text-[#C97863] underline cursor-pointer"
                        >
                          Draft Notice
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. ACTION CENTER (CARDS) */}
      <div className="bg-[#FFF8F1] rounded-3xl p-6 sm:p-8 border border-[#FDE8DC] shadow-sm space-y-6">
        <div>
          <h3 className="text-xl font-extrabold text-[#3A3331]">Action Center</h3>
          <p className="text-xs text-[#756B66] mt-0.5">Pre-composed messages and downstream recovery steps</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Action 1: Hotel Late Notice */}
          <div className="p-5 rounded-2xl bg-white border border-[#FDE8DC] flex flex-col justify-between space-y-4 hover:border-[#D9826B] hover:shadow-sm transition-all">
            <div className="space-y-2">
              <div className="w-9 h-9 rounded-xl bg-[#FDE8DC] text-[#C97863] flex items-center justify-center">
                <Hotel className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-[#3A3331]">Notify Hotel Front Desk</h4>
              <p className="text-xs text-[#756B66] leading-relaxed">
                Send a pre-formatted message alerting your hotel to hold your room past check-in cutoff.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-[#FDE8DC]">
              <span className="text-[11px] font-bold text-[#D9826B] bg-[#FDE8DC] px-2 py-0.5 rounded">
                Draft Ready
              </span>
              <button
                type="button"
                onClick={() => setActiveModal('hotel')}
                className="text-xs font-bold text-[#3A3331] hover:text-[#D9826B] flex items-center gap-1 cursor-pointer"
              >
                <span>Preview Notice</span>
                <ChevronRight className="w-4 h-4 text-[#D9826B]" />
              </button>
            </div>
          </div>

          {/* Action 2: Restaurant Reservation Notice */}
          <div className="p-5 rounded-2xl bg-white border border-[#FDE8DC] flex flex-col justify-between space-y-4 hover:border-[#D9826B] hover:shadow-sm transition-all">
            <div className="space-y-2">
              <div className="w-9 h-9 rounded-xl bg-[#F6D9DC] text-[#3A3331] flex items-center justify-center">
                <Utensils className="w-5 h-5 text-[#C97863]" />
              </div>
              <h4 className="font-bold text-sm text-[#3A3331]">Update Dinner Host</h4>
              <p className="text-xs text-[#756B66] leading-relaxed">
                Request a 30-minute table holding window or reschedule dinner seamlessly.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-[#FDE8DC]">
              <span className="text-[11px] font-bold text-[#3A3331] bg-[#F6D9DC] px-2 py-0.5 rounded">
                Draft Ready
              </span>
              <button
                type="button"
                onClick={() => setActiveModal('restaurant')}
                className="text-xs font-bold text-[#3A3331] hover:text-[#D9826B] flex items-center gap-1 cursor-pointer"
              >
                <span>Preview Message</span>
                <ChevronRight className="w-4 h-4 text-[#D9826B]" />
              </button>
            </div>
          </div>

          {/* Action 3: Alternative Transport */}
          <div className="p-5 rounded-2xl bg-white border border-[#FDE8DC] flex flex-col justify-between space-y-4 hover:border-[#D9826B] hover:shadow-sm transition-all">
            <div className="space-y-2">
              <div className="w-9 h-9 rounded-xl bg-[#E9DDF2] text-[#3A3331] flex items-center justify-center">
                <Train className="w-5 h-5 text-[#756B66]" />
              </div>
              <h4 className="font-bold text-sm text-[#3A3331]">Find Alternative Transport</h4>
              <p className="text-xs text-[#756B66] leading-relaxed">
                Explore faster trains, intercity luxury buses, or flights between {trip.origin} and {trip.destination}.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-[#FDE8DC]">
              <span className="text-[11px] font-bold text-[#756B66] bg-[#E9DDF2] px-2 py-0.5 rounded">
                Options Available
              </span>
              <button
                type="button"
                onClick={() => setActiveModal('alternativeTransport')}
                className="text-xs font-bold text-[#3A3331] hover:text-[#D9826B] flex items-center gap-1 cursor-pointer"
              >
                <span>View Options</span>
                <ChevronRight className="w-4 h-4 text-[#D9826B]" />
              </button>
            </div>
          </div>

          {/* Action 4: Update Itinerary */}
          <div className="p-5 rounded-2xl bg-white border border-[#FDE8DC] flex flex-col justify-between space-y-4 hover:border-[#D9826B] hover:shadow-sm transition-all">
            <div className="space-y-2">
              <div className="w-9 h-9 rounded-xl bg-[#DCE8D5] text-[#3A3331] flex items-center justify-center">
                <Calendar className="w-5 h-5 text-[#3A3331]" />
              </div>
              <h4 className="font-bold text-sm text-[#3A3331]">Update Itinerary</h4>
              <p className="text-xs text-[#756B66] leading-relaxed">
                Sync the new timeline directly with your Google Calendar, Apple Calendar, or export as .ICS.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-[#FDE8DC]">
              <span className="text-[11px] font-bold text-[#3A3331] bg-[#DCE8D5] px-2 py-0.5 rounded">
                Export Ready
              </span>
              <button
                type="button"
                onClick={() => setActiveModal('exportCalendar')}
                className="text-xs font-bold text-[#3A3331] hover:text-[#D9826B] flex items-center gap-1 cursor-pointer"
              >
                <span>Export Plan</span>
                <ChevronRight className="w-4 h-4 text-[#D9826B]" />
              </button>
            </div>
          </div>

          {/* Action 5: Share Trip Plan */}
          <div className="p-5 rounded-2xl bg-white border border-[#FDE8DC] flex flex-col justify-between space-y-4 hover:border-[#D9826B] hover:shadow-sm transition-all sm:col-span-2 lg:col-span-2">
            <div className="space-y-2">
              <div className="w-9 h-9 rounded-xl bg-[#FDE8DC] text-[#D9826B] flex items-center justify-center">
                <Share2 className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-[#3A3331]">Share Trip Plan</h4>
              <p className="text-xs text-[#756B66] leading-relaxed">
                Generate an instant formatted text update for your companions, rideshare pickup, or colleagues meeting you in {trip.destination}.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-[#FDE8DC]">
              <span className="text-[11px] font-bold text-[#C97863] bg-[#FDE8DC] px-2 py-0.5 rounded">
                Instant Summary
              </span>
              <button
                type="button"
                onClick={() => setActiveModal('sharePlan')}
                className="text-xs font-bold text-[#3A3331] hover:text-[#D9826B] flex items-center gap-1 cursor-pointer"
              >
                <span>Share Recovery Plan</span>
                <ChevronRight className="w-4 h-4 text-[#D9826B]" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Render Active Modal */}
      <ActionModals
        modalType={activeModal}
        onClose={() => setActiveModal(null)}
        plan={plan}
        trip={trip}
      />
    </div>
  );
};
