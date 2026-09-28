import React, { useEffect, useState } from 'react';
import { Compass, CheckCircle2, Clock, Sparkles } from 'lucide-react';

interface LoadingStateProps {
  onComplete?: () => void;
}

const STAGES = [
  'Analyzing trip...',
  'Checking conflicts...',
  'Rebuilding itinerary...',
  'Recovery plan ready.',
];

export const LoadingState: React.FC<LoadingStateProps> = () => {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);

  useEffect(() => {
    let step = 0;
    const timer = setInterval(() => {
      step++;
      if (step < STAGES.length) {
        setCurrentStageIndex(step);
      } else {
        clearInterval(timer);
      }
    }, 600);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="max-w-xl mx-auto my-12 bg-[#FFF8F1] rounded-3xl p-8 sm:p-10 border border-[#FDE8DC] shadow-sm text-center space-y-7 animate-in fade-in duration-300">
      {/* Calm compass indicator */}
      <div className="relative mx-auto w-16 h-16 flex items-center justify-center">
        <div className="w-16 h-16 rounded-2xl bg-[#D9826B] flex items-center justify-center text-white shadow-xs">
          <Compass className="w-8 h-8 animate-spin text-white" style={{ animationDuration: '6s' }} />
        </div>
      </div>

      <div className="space-y-1.5">
        <h3 className="text-xl sm:text-2xl font-extrabold text-[#3A3331] tracking-tight">
          Rebuilding Your Travel Plan
        </h3>
        <p className="text-xs sm:text-sm text-[#756B66]">
          Calculating realistic buffers and checking downstream reservations
        </p>
      </div>

      {/* Subtle sequential loading stages */}
      <div className="space-y-2.5 text-left max-w-sm mx-auto">
        {STAGES.map((stageText, idx) => {
          const isDone = idx < currentStageIndex;
          const isCurrent = idx === currentStageIndex;
          const isPending = idx > currentStageIndex;

          return (
            <div
              key={stageText}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl border text-xs transition-all duration-300 ${
                isDone
                  ? 'bg-[#DCE8D5]/60 border-[#DCE8D5] text-[#3A3331] font-semibold'
                  : isCurrent
                  ? 'bg-white border-[#D9826B] text-[#D9826B] font-bold shadow-2xs'
                  : 'bg-transparent border-transparent text-[#756B66]/60'
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="w-4 h-4 text-[#D9826B] shrink-0" />
              ) : isCurrent ? (
                <span className="w-3.5 h-3.5 rounded-full border-2 border-[#D9826B] border-t-transparent animate-spin shrink-0" />
              ) : (
                <Clock className="w-3.5 h-3.5 text-[#756B66]/40 shrink-0" />
              )}
              <span>{stageText}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
