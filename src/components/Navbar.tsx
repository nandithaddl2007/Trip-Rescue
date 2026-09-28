import React, { useState } from 'react';
import { Compass, Menu, X, Sparkles, ShieldAlert } from 'lucide-react';

interface NavbarProps {
  onRescueClick: () => void;
  onHowItWorksClick: () => void;
  onFeaturesClick: () => void;
  onLoadDemo: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onRescueClick,
  onHowItWorksClick,
  onFeaturesClick,
  onLoadDemo,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#FFF8F1]/95 backdrop-blur-md border-b border-[#FDE8DC] text-[#3A3331]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18">
            {/* Brand Logo */}
            <div
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <div className="w-10 h-10 rounded-2xl bg-[#D9826B] flex items-center justify-center text-white shadow-sm shadow-[#D9826B]/25 group-hover:scale-105 transition-transform duration-300">
                <Compass className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight text-[#3A3331] flex items-center gap-1.5">
                  TripRescue <span className="text-[#D9826B] font-extrabold">AI</span>
                </span>
                <span className="text-[10px] uppercase tracking-wider text-[#756B66] font-medium">
                  Travel Recovery Assistant
                </span>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-[#756B66]">
              <button
                onClick={onHowItWorksClick}
                className="hover:text-[#D9826B] transition-colors cursor-pointer"
              >
                How It Works
              </button>
              <button
                onClick={onFeaturesClick}
                className="hover:text-[#D9826B] transition-colors cursor-pointer"
              >
                Features
              </button>
              <button
                onClick={onLoadDemo}
                className="hover:text-[#D9826B] transition-colors flex items-center gap-1.5 cursor-pointer text-[#C97863]"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#D9826B]" />
                <span>Demo Itinerary</span>
              </button>
              <button
                onClick={() => setShowAboutModal(true)}
                className="hover:text-[#D9826B] transition-colors cursor-pointer"
              >
                About
              </button>
            </nav>

            {/* Desktop Action Button */}
            <div className="hidden md:flex items-center gap-3">
              <a
                href="https://ndthequeen.app.n8n.cloud/webhook/9599e7a0-8f37-47d4-97ee-00cbef98f6c6/chat"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#E9DDF2] hover:bg-[#E9DDF2]/80 text-[#3A3331] text-xs font-semibold border border-[#E9DDF2] transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#C97863]" />
                <span>TripRescue Assistant</span>
              </a>
              <button
                onClick={onRescueClick}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#D9826B] hover:bg-[#C97863] text-white text-sm font-semibold shadow-sm shadow-[#D9826B]/30 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <ShieldAlert className="w-4 h-4 text-amber-200" />
                <span>Rescue My Trip</span>
              </button>
            </div>

            {/* Mobile menu trigger */}
            <div className="md:hidden flex items-center gap-2">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-[#756B66] hover:text-[#3A3331] hover:bg-[#FDE8DC] focus:outline-none"
                aria-label="Toggle Navigation"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#FFF8F1] border-b border-[#FDE8DC] px-4 pt-3 pb-5 space-y-3 animate-in slide-in-from-top-2">
            <button
              onClick={() => {
                onHowItWorksClick();
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 text-sm text-[#756B66] hover:text-[#D9826B] font-medium"
            >
              How It Works
            </button>
            <button
              onClick={() => {
                onFeaturesClick();
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 text-sm text-[#756B66] hover:text-[#D9826B] font-medium"
            >
              Features
            </button>
            <button
              onClick={() => {
                onLoadDemo();
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 text-sm text-[#C97863] font-medium"
            >
              Load Example Demo (Vizag → Hyderabad)
            </button>
            <button
              onClick={() => {
                setShowAboutModal(true);
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 text-sm text-[#756B66] hover:text-[#D9826B] font-medium"
            >
              About TripRescue AI
            </button>
            <div className="pt-2 flex flex-col gap-2">
              <a
                href="https://ndthequeen.app.n8n.cloud/webhook/9599e7a0-8f37-47d4-97ee-00cbef98f6c6/chat"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#E9DDF2] text-[#3A3331] font-semibold text-xs border border-[#E9DDF2]"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#C97863]" />
                <span>TripRescue Assistant</span>
              </a>
              <button
                onClick={() => {
                  onRescueClick();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#D9826B] text-white font-semibold text-sm shadow-sm"
              >
                <ShieldAlert className="w-4 h-4 text-amber-200" />
                <span>Rescue My Trip</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* About Modal */}
      {showAboutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3A3331]/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-[#FFF8F1] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-xl border border-[#FDE8DC]">
            <div className="flex items-center justify-between pb-4 border-b border-[#FDE8DC]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#D9826B] flex items-center justify-center text-white">
                  <Compass className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-[#3A3331]">About TripRescue AI</h3>
              </div>
              <button
                onClick={() => setShowAboutModal(false)}
                className="text-[#756B66] hover:text-[#3A3331] p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4 text-sm text-[#756B66] leading-relaxed">
              <p>
                <strong className="text-[#3A3331]">TripRescue AI</strong> is a modern travel recovery intelligence platform designed for travelers facing sudden flight delays, cancelled trains, missed connections, or schedule alterations.
              </p>
              <div className="bg-[#FDE8DC] p-4 rounded-2xl border border-[#FDE8DC] space-y-2">
                <h4 className="font-semibold text-[#3A3331] text-xs uppercase tracking-wider">Product Integrity Standard</h4>
                <p className="text-xs text-[#756B66]">
                  We clearly separate your original itinerary from AI-generated recommendations and external agent actions. We never pretend an unverified booking or cancellation was executed without confirmation.
                </p>
              </div>
              <p>
                Engineered with practical travel buffer heuristics, local transit clearance math, and generative intelligence to rescue your trip in seconds.
              </p>
            </div>

            <div className="pt-3 border-t border-[#FDE8DC] flex justify-end">
              <button
                onClick={() => setShowAboutModal(false)}
                className="px-5 py-2.5 bg-[#D9826B] text-white rounded-xl text-xs font-semibold hover:bg-[#C97863] shadow-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
