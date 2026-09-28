import React from 'react';
import { Compass, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onRescueClick: () => void;
  onHowItWorksClick: () => void;
  onFeaturesClick: () => void;
  onLoadDemo: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onRescueClick,
  onHowItWorksClick,
  onFeaturesClick,
  onLoadDemo,
}) => {
  return (
    <footer className="bg-[#F6D9DC]/60 text-[#756B66] py-14 border-t border-[#FDE8DC] text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-[#FDE8DC]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#D9826B] flex items-center justify-center text-white shadow-xs">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[#3A3331] font-bold text-base">TripRescue AI</span>
              <p className="text-xs text-[#756B66] mt-0.5">
                Intelligent Travel Recovery Assistant
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-6 text-xs font-semibold text-[#756B66]">
            <button onClick={onRescueClick} className="hover:text-[#D9826B] transition-colors cursor-pointer">
              Rescue My Trip
            </button>
            <button onClick={onHowItWorksClick} className="hover:text-[#D9826B] transition-colors cursor-pointer">
              How It Works
            </button>
            <button onClick={onFeaturesClick} className="hover:text-[#D9826B] transition-colors cursor-pointer">
              Features
            </button>
            <button onClick={onLoadDemo} className="hover:text-[#D9826B] text-[#C97863] transition-colors cursor-pointer">
              Demo Itinerary (Visakhapatnam → Hyderabad)
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#756B66]">
          <p>
            © {new Date().getFullYear()} TripRescue AI. Built for gentle, resilient travel.
          </p>
          <div className="flex items-center gap-1.5 text-[#756B66]">
            <ShieldCheck className="w-4 h-4 text-[#C97863]" />
            <span>AI advisory engine · Verify all ticket updates with transport operators</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
