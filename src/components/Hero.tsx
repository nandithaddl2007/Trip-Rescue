import React from 'react';
import heroBgImage from '../assets/images/traveler_airport_hero_1790603727115.jpg';
import {
  ShieldAlert,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Route,
  ArrowDownRight,
  Plane,
} from 'lucide-react';

interface HeroProps {
  onRescueClick: () => void;
  onHowItWorksClick: () => void;
  onLoadDemo: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onRescueClick,
  onHowItWorksClick,
  onLoadDemo,
}) => {
  return (
    <section className="relative overflow-hidden bg-[#FFF8F1] pt-14 pb-20 lg:pt-20 lg:pb-28">
      {/* Full-width Cinematic Travel Background with Warm Translucent Overlay */}
      <div className="absolute inset-0 pointer-events-none select-none z-0">
        <img
          src={heroBgImage}
          alt="Traveler with luggage suitcases and boarding ticket at the airport airplane tarmac"
          className="w-full h-full object-cover object-center filter brightness-[0.90] contrast-[1.03] saturate-[1.08]"
          loading="eager"
          referrerPolicy="no-referrer"
        />
        {/* Subtle, translucent warm ivory / peach / blush gradient overlay preserving photograph visibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#FFF8F1]/95 via-[#FFF8F1]/82 to-[#FDE8DC]/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#FFF8F1] via-[#FFF8F1]/30 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#F6D9DC]/35 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Headline and Call-to-actions */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Header kicker */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E9DDF2]/80 border border-[#E9DDF2] text-xs font-bold uppercase tracking-wider text-[#3A3331]">
              <span className="w-2 h-2 rounded-full bg-[#D9826B] animate-pulse" />
              <span>TRIPRESCUE AI</span>
              <span className="text-[#756B66]/60">·</span>
              <span className="text-[#756B66] font-medium lowercase">real-time travel recovery</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#3A3331] leading-[1.12]">
              Your journey changed.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D9826B] via-[#C97863] to-[#D9826B]">
                Your plan doesn't have to.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-[#756B66] max-w-2xl font-normal leading-relaxed">
              An AI travel recovery assistant that helps you rebuild your itinerary when delays, cancellations, or unexpected changes happen.
            </p>

            {/* Action buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <button
                onClick={onRescueClick}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-[#D9826B] hover:bg-[#C97863] text-white font-semibold text-base shadow-lg shadow-[#D9826B]/25 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <ShieldAlert className="w-5 h-5 text-amber-100" />
                <span>🚨 Rescue My Trip</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <button
                onClick={onHowItWorksClick}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#FFF8F1]/90 hover:bg-[#FFF8F1] text-[#3A3331] border border-[#FDE8DC] font-semibold text-base backdrop-blur-md shadow-xs transition-colors cursor-pointer"
              >
                <span>See How It Works</span>
              </button>
            </div>

            {/* Quick Demo Experience trigger */}
            <div className="pt-4 border-t border-[#FDE8DC]">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-xs text-[#756B66]">
                <span className="font-medium text-[#3A3331] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#D9826B]" />
                  Try live scenario:
                </span>
                <button
                  onClick={onLoadDemo}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#FDE8DC]/90 hover:bg-[#FDE8DC] text-[#3A3331] border border-[#FDE8DC] text-xs font-semibold transition-all cursor-pointer text-left shadow-2xs"
                >
                  <span>Visakhapatnam → Hyderabad · Train delayed 3h</span>
                  <ArrowRight className="w-3 h-3 text-[#D9826B]" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Travel-themed Interactive Journey Visual */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none bg-[#FFF8F1]/95 rounded-3xl p-6 border border-[#FDE8DC] shadow-xl backdrop-blur-md">
              {/* Card Header / Route preview */}
              <div className="flex items-center justify-between pb-4 border-b border-[#FDE8DC] text-xs text-[#756B66]">
                <div className="flex items-center gap-2">
                  <Route className="w-4 h-4 text-[#D9826B]" />
                  <span className="font-bold text-[#3A3331]">LIVE RECOVERY TIMELINE</span>
                </div>
                <span className="text-[#D9826B] font-mono text-[11px] font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#D9826B] animate-ping" />
                  DISRUPTION DETECTED
                </span>
              </div>

              {/* Journey Nodes Visual */}
              <div className="mt-5 space-y-4">
                {/* Station Origin */}
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 w-6 h-6 rounded-full bg-[#DCE8D5] border border-[#DCE8D5] flex items-center justify-center shrink-0">
                    <div className="w-2 h-2 rounded-full bg-[#3A3331]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#3A3331]">Visakhapatnam (VSKP)</span>
                      <span className="text-[#756B66] font-mono">05:30 AM</span>
                    </div>
                    <p className="text-[11px] text-[#756B66]">Godavari Express #12727 · Departed</p>
                  </div>
                </div>

                {/* Connecting Transit line with Delay Breakdown */}
                <div className="pl-3 py-1 flex items-center gap-3">
                  <div className="w-0.5 h-12 bg-gradient-to-b from-[#DCE8D5] via-[#D9826B] to-[#C97863] ml-[-1px]" />
                  <div className="bg-[#F6D9DC]/80 border border-[#F6D9DC] rounded-xl p-2.5 text-xs flex-1">
                    <div className="flex items-center justify-between font-bold text-[#3A3331]">
                      <span className="flex items-center gap-1.5 text-[#C97863]">
                        <AlertTriangle className="w-3.5 h-3.5 text-[#D9826B]" />
                        Train delayed by 3 hours
                      </span>
                      <span className="text-[11px] font-mono text-[#D9826B]">+180 min</span>
                    </div>
                    <p className="text-[11px] text-[#756B66] mt-0.5">
                      Signal failure near Vijayawada. Track clearance in progress.
                    </p>
                  </div>
                </div>

                {/* Disrupted Arrival vs Recovered Arrival */}
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 w-6 h-6 rounded-full bg-[#FDE8DC] border border-[#D9826B]/30 flex items-center justify-center shrink-0">
                    <Clock className="w-3 h-3 text-[#D9826B]" />
                  </div>
                  <div className="flex-1 min-w-0 bg-white/90 rounded-2xl p-3 border border-[#FDE8DC]">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#756B66] line-through">4:00 PM Scheduled</span>
                      <span className="font-bold text-[#D9826B] font-mono text-sm">7:00 PM Revised</span>
                    </div>
                    <p className="text-xs font-semibold text-[#3A3331] mt-1">Arrival in Hyderabad (HYB)</p>
                  </div>
                </div>

                {/* AI Recalculation Flow Arrow */}
                <div className="flex items-center gap-2 text-xs font-bold text-[#3A3331] pl-8">
                  <ArrowDownRight className="w-4 h-4 text-[#D9826B] animate-bounce" />
                  <span>TripRescue AI Auto-Reordered Plans</span>
                </div>

                {/* Rescheduled items preview */}
                <div className="pl-6 space-y-2 text-xs">
                  <div className="flex items-center justify-between bg-white rounded-xl p-2.5 border border-[#FDE8DC] shadow-2xs">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#D9826B]" />
                      <span className="text-[#3A3331] font-semibold">Hotel Check-in</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="text-[#756B66] line-through text-[11px]">6:00 PM</span>
                      <span className="text-[#D9826B] font-bold">7:20 PM</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between bg-white rounded-xl p-2.5 border border-[#FDE8DC] shadow-2xs">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#D9826B]" />
                      <span className="text-[#3A3331] font-semibold">Dinner at Spice Garden</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="text-[#756B66] line-through text-[11px]">8:00 PM</span>
                      <span className="text-[#D9826B] font-bold">8:30 PM</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="mt-4 pt-3 border-t border-[#FDE8DC] flex items-center justify-between text-[11px] text-[#756B66]">
                <span className="flex items-center gap-1 font-medium text-[#3A3331]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#D9826B]" />
                  Zero bookings lost
                </span>
                <span className="font-mono text-[#756B66]">30 min buffer preserved</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
