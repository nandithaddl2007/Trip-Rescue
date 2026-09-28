import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Send,
  Plane,
  Sparkles,
  ExternalLink,
  Minimize2,
  Maximize2,
  AlertTriangle,
  Clock,
  MapPin,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';

interface StructuredRecoveryData {
  issueDetected?: string;
  newTiming?: string;
  affectedBooking?: string;
  suggestedAction?: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  structured?: StructuredRecoveryData;
  isQuickHelp?: boolean;
}

const N8N_DIRECT_URL = 'https://ndthequeen.app.n8n.cloud/webhook/9599e7a0-8f37-47d4-97ee-00cbef98f6c6/chat';

const QUICK_ACTIONS = [
  { id: 'train-delay', label: '🚆 Train delayed', prompt: 'My train is delayed by 3 hours and I have a hotel check-in at 6 PM.' },
  { id: 'flight-cancel', label: '✈️ Flight cancelled', prompt: 'My flight was cancelled and I have a connecting flight and hotel tonight.' },
  { id: 'missed-conn', label: '🔄 Missed connection', prompt: 'I missed my transfer connection and need to reschedule downstream plans.' },
  { id: 'hotel-issue', label: '🏨 Hotel issue', prompt: 'I will arrive late past the standard hotel check-in cut-off time.' },
  { id: 'itinerary-change', label: '🗓️ My itinerary changed', prompt: 'My schedule shifted by 2 hours and I have dinner reservations booked.' },
  { id: 'something-else', label: '💬 Something else', prompt: 'I need guidance on recovering a disrupted travel schedule.' },
];

export const N8nChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'interactive' | 'embedded'>('interactive');
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => 'trip-rescue-user-' + Math.random().toString(36).substring(2, 9));
  
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-triprescue',
      sender: 'assistant',
      text: "Hi! I'm your TripRescue Assistant. Tell me what happened with your trip, and I'll help you figure out the next best steps.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isQuickHelp: true,
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Extract structured travel cards from assistant answers
  const parseStructuredTravelData = (text: string): StructuredRecoveryData | undefined => {
    const lower = text.toLowerCase();
    const hasDelayOrDisrupt = lower.includes('delay') || lower.includes('cancel') || lower.includes('missed') || lower.includes('disrupt');
    
    if (!hasDelayOrDisrupt) return undefined;

    let issue = '';
    let timing = '';
    let booking = '';
    let action = '';

    if (lower.includes('train')) issue = 'Train delay / schedule shift in transit';
    else if (lower.includes('flight')) issue = 'Flight disruption / schedule alteration';
    else if (lower.includes('connection')) issue = 'Missed transfer connection';
    else issue = 'Schedule deviation affecting arrival timeline';

    if (lower.includes('3 hour') || lower.includes('3-hour')) timing = '+3 hours delay · Estimated arrival pushed forward';
    else if (lower.includes('2 hour') || lower.includes('2-hour')) timing = '+2 hours delay · Tight evening buffer';
    else if (lower.includes('hour')) timing = 'Arrival shifted by travel delay window';

    if (lower.includes('hotel') || lower.includes('check-in')) booking = 'Hotel Check-in & guaranteed room reservation';
    else if (lower.includes('dinner') || lower.includes('restaurant')) booking = 'Dining reservation & table holding policy';
    else booking = 'Downstream activities and transfer connections';

    action = 'Re-sequence itinerary sequence, insert 20m station clearance buffer & dispatch late arrival notice.';

    return {
      issueDetected: issue,
      newTiming: timing || undefined,
      affectedBooking: booking,
      suggestedAction: action,
    };
  };

  const handleSendMessage = async (customPrompt?: string) => {
    const messageToSend = typeof customPrompt === 'string' ? customPrompt : inputMessage;
    const trimmed = messageToSend.trim();
    if (!trimmed || isLoading) return;

    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      let replyText = '';
      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: trimmed,
            sessionId,
            chatHistory: messages.map((m) => ({ role: m.sender, content: m.text })),
          }),
        });

        if (res.ok) {
          const data = await res.json();
          replyText =
            data.output ||
            data.text ||
            data.message ||
            data.response ||
            (typeof data === 'string' ? data : JSON.stringify(data));
        } else {
          throw new Error('Proxy status ' + res.status);
        }
      } catch (proxyErr) {
        console.warn('Proxy error, attempting direct webhook:', proxyErr);
        const directRes = await fetch(N8N_DIRECT_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chatInput: trimmed,
            message: trimmed,
            sessionId,
          }),
        });
        const data = await directRes.json();
        replyText =
          data.output ||
          data.text ||
          data.message ||
          data.response ||
          (typeof data === 'string' ? data : 'Response received.');
      }

      // If reply is empty or fallback, formulate calm travel recovery assistant response
      if (!replyText || replyText.trim() === '{}') {
        replyText = `Got it. That disruption directly impacts your downstream schedule.

I can help you:
• Check which parts of your itinerary are affected
• Rebuild your schedule with realistic transit buffers
• Identify timing conflicts before they cause cancellations
• Draft notices for your hotel and dinner hosts

Would you like me to rescue your itinerary?`;
      }

      const structured = parseStructuredTravelData(trimmed + ' ' + replyText);

      const botMsg: ChatMessage = {
        id: 'bot-' + Date.now(),
        sender: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        structured,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      console.error('Failed to communicate with n8n chatbot:', err);
      const fallbackReply = `Got it. Travel delays can quickly ripple into your hotel check-in and reservations.

I can help you:
• check which parts of your itinerary are affected
• rebuild your schedule
• identify timing conflicts
• suggest what to adjust next

Would you like me to rescue your itinerary?`;

      const botMsg: ChatMessage = {
        id: 'bot-fallback-' + Date.now(),
        sender: 'assistant',
        text: fallbackReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        structured: {
          issueDetected: 'Travel delay / schedule disruption',
          newTiming: 'Timeline shifted by delay duration',
          affectedBooking: 'Hotel check-in & evening bookings',
          suggestedAction: 'Run 🚨 Rescue My Trip on the dashboard to calculate revised times with 20m buffers.',
        },
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickActionClick = (prompt: string) => {
    handleSendMessage(prompt);
  };

  return (
    <>
      {/* Floating Branded Launcher Button with Warm Pastel Styling */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen ? (
          <button
            onClick={() => setIsOpen(true)}
            className="group flex items-center gap-3 px-5 py-3.5 rounded-full bg-[#FFF8F1] text-[#3A3331] shadow-xl shadow-[#D9826B]/20 hover:shadow-2xl hover:shadow-[#D9826B]/30 transition-all duration-300 hover:scale-105 active:scale-95 border-2 border-[#D9826B] cursor-pointer"
            aria-label="Open TripRescue Assistant"
          >
            <div className="relative w-8 h-8 rounded-full bg-[#D9826B] flex items-center justify-center shadow-xs">
              <Plane className="w-4 h-4 text-white -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-[#DCE8D5] rounded-full ring-2 ring-[#FFF8F1] border border-[#3A3331]" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold tracking-tight text-[#3A3331] flex items-center gap-1.5">
                TripRescue Assistant
              </span>
              <span className="text-[10px] text-[#756B66] flex items-center gap-1 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D9826B]" />
                Ready to help
              </span>
            </div>
          </button>
        ) : null}
      </div>

      {/* Chatbot Window with Soft Lavender / Warm Ivory Palette */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-300 ${
            isExpanded
              ? 'inset-3 sm:inset-8 md:inset-12'
              : 'bottom-5 right-5 w-[94vw] sm:w-[420px] h-[610px] max-h-[88vh]'
          }`}
        >
          <div className="w-full h-full bg-[#FFF8F1] rounded-3xl shadow-2xl border border-[#FDE8DC] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300 ring-1 ring-[#D9826B]/20">
            {/* Branded Header - Warm Peach & Coral Accent */}
            <div className="bg-[#FDE8DC] px-5 py-4 text-[#3A3331] flex items-center justify-between border-b border-[#FDE8DC]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#D9826B] flex items-center justify-center text-white shadow-xs">
                  <Plane className="w-5 h-5 -rotate-45" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#3A3331] flex items-center gap-1.5">
                    ✈️ TripRescue Assistant
                  </h3>
                  <div className="flex items-center gap-1.5 text-[11px] text-[#756B66] font-medium">
                    <span className="w-2 h-2 rounded-full bg-[#D9826B] animate-pulse" />
                    <span className="text-[#C97863] font-bold">Ready to help</span>
                    <span className="text-[#756B66]/60">·</span>
                    <span className="text-[#756B66] text-[10px]">AI Recovery Intelligence</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 text-[#756B66]">
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-1.5 hover:text-[#3A3331] hover:bg-[#FFF8F1] rounded-lg transition-colors cursor-pointer"
                  title={isExpanded ? 'Minimize' : 'Expand'}
                >
                  {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:text-[#3A3331] hover:bg-[#FFF8F1] rounded-lg transition-colors cursor-pointer"
                  title="Close Assistant"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* View Mode Toggle Bar - Pastel Lavender */}
            <div className="bg-[#E9DDF2]/60 px-4 py-2 flex items-center justify-between border-b border-[#E9DDF2] text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('interactive')}
                  className={`px-3 py-1 rounded-xl font-bold transition-all cursor-pointer ${
                    activeTab === 'interactive'
                      ? 'bg-white text-[#D9826B] shadow-2xs border border-[#FDE8DC]'
                      : 'text-[#756B66] hover:text-[#3A3331]'
                  }`}
                >
                  Assistant Chat
                </button>
                <button
                  onClick={() => setActiveTab('embedded')}
                  className={`px-3 py-1 rounded-xl font-bold transition-all cursor-pointer ${
                    activeTab === 'embedded'
                      ? 'bg-white text-[#D9826B] shadow-2xs border border-[#FDE8DC]'
                      : 'text-[#756B66] hover:text-[#3A3331]'
                  }`}
                >
                  Direct n8n View
                </button>
              </div>

              <a
                href={N8N_DIRECT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-semibold text-[#756B66] hover:text-[#D9826B] flex items-center gap-1"
                title="Open in new window"
              >
                <span>External</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Content Body */}
            {activeTab === 'interactive' ? (
              <div className="flex-1 flex flex-col min-h-0 bg-[#FFF8F1]">
                {/* Messages Scroll Area */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
                  {messages.map((msg) => {
                    const isBot = msg.sender === 'assistant';
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isBot ? 'items-start' : 'items-end'} space-y-2`}
                      >
                        <div
                          className={`flex items-start gap-2.5 ${isBot ? '' : 'flex-row-reverse'} max-w-[92%]`}
                        >
                          <div
                            className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-xs shadow-2xs ${
                              isBot
                                ? 'bg-[#D9826B] text-white'
                                : 'bg-[#3A3331] text-white'
                            }`}
                          >
                            {isBot ? <Plane className="w-3.5 h-3.5 -rotate-45" /> : <span className="font-bold text-[10px]">YOU</span>}
                          </div>

                          <div
                            className={`rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-2xs ${
                              isBot
                                ? 'bg-[#FDE8DC]/80 text-[#3A3331] border border-[#FDE8DC]'
                                : 'bg-[#D9826B] text-white'
                            }`}
                          >
                            <p className="whitespace-pre-wrap">{msg.text}</p>
                            <span
                              className={`block mt-1.5 text-[9px] ${
                                isBot ? 'text-[#756B66]' : 'text-white/80 text-right'
                              }`}
                            >
                              {msg.timestamp}
                            </span>
                          </div>
                        </div>

                        {/* Structured Recovery Card (When applicable) - Soft Pastel accents */}
                        {msg.structured && (
                          <div className="ml-9 max-w-[88%] bg-white rounded-2xl p-3.5 border border-[#FDE8DC] shadow-xs space-y-2.5 text-xs text-[#3A3331] animate-in fade-in slide-in-from-top-1">
                            {msg.structured.issueDetected && (
                              <div className="flex items-start gap-2 bg-[#F6D9DC]/70 p-2.5 rounded-xl border border-[#F6D9DC] text-[#3A3331]">
                                <span className="font-bold text-[#C97863] flex items-center gap-1 shrink-0">
                                  ⚠️ Issue detected:
                                </span>
                                <span>{msg.structured.issueDetected}</span>
                              </div>
                            )}

                            {msg.structured.newTiming && (
                              <div className="flex items-start gap-2 bg-[#E9DDF2]/70 p-2.5 rounded-xl border border-[#E9DDF2] text-[#3A3331]">
                                <span className="font-bold text-[#756B66] flex items-center gap-1 shrink-0">
                                  🕒 New timing:
                                </span>
                                <span>{msg.structured.newTiming}</span>
                              </div>
                            )}

                            {msg.structured.affectedBooking && (
                              <div className="flex items-start gap-2 bg-[#FDE8DC]/60 p-2.5 rounded-xl border border-[#FDE8DC] text-[#3A3331]">
                                <span className="font-bold text-[#756B66] flex items-center gap-1 shrink-0">
                                  📍 Affected booking:
                                </span>
                                <span>{msg.structured.affectedBooking}</span>
                              </div>
                            )}

                            {msg.structured.suggestedAction && (
                              <div className="flex items-start gap-2 bg-[#DCE8D5]/70 p-2.5 rounded-xl border border-[#DCE8D5] text-[#3A3331]">
                                <span className="font-bold text-[#3A3331] flex items-center gap-1 shrink-0">
                                  ✅ Suggested action:
                                </span>
                                <span>{msg.structured.suggestedAction}</span>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Quick-Action Buttons after Welcome message */}
                        {msg.isQuickHelp && (
                          <div className="ml-9 pt-1 grid grid-cols-2 gap-2 w-full max-w-[90%]">
                            {QUICK_ACTIONS.map((action) => (
                              <button
                                key={action.id}
                                type="button"
                                onClick={() => handleQuickActionClick(action.prompt)}
                                className="px-3 py-2 rounded-xl bg-white hover:bg-[#FDE8DC] text-[#3A3331] text-xs font-semibold border border-[#FDE8DC] shadow-2xs transition-all text-left flex items-center justify-between cursor-pointer"
                              >
                                <span>{action.label}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {isLoading && (
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-xl bg-[#D9826B] text-white flex items-center justify-center shrink-0">
                        <Plane className="w-3.5 h-3.5 -rotate-45" />
                      </div>
                      <div className="bg-[#FDE8DC]/80 border border-[#FDE8DC] rounded-2xl px-4 py-3 shadow-2xs flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#D9826B] animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 rounded-full bg-[#D9826B] animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 rounded-full bg-[#D9826B] animate-bounce" style={{ animationDelay: '300ms' }} />
                        <span className="text-[11px] text-[#756B66] font-medium ml-1.5">
                          TripRescue Assistant analyzing...
                        </span>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Input Bar with Coral Send Button */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="p-3 bg-[#FFF8F1] border-t border-[#FDE8DC] flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Tell me what happened with your trip..."
                    className="flex-1 px-4 py-2.5 rounded-xl border border-[#FDE8DC] bg-white focus:outline-none focus:ring-2 focus:ring-[#D9826B] text-xs sm:text-sm text-[#3A3331] placeholder:text-[#756B66]/60"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    disabled={!inputMessage.trim() || isLoading}
                    className="p-2.5 rounded-xl bg-[#D9826B] hover:bg-[#C97863] text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-sm shadow-[#D9826B]/25"
                    aria-label="Send message"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            ) : (
              /* Embedded n8n direct chat iframe view */
              <div className="flex-1 relative bg-[#FFF8F1] flex flex-col">
                <div className="p-2 bg-[#FDE8DC] border-b border-[#FDE8DC] text-[11px] text-[#3A3331] flex items-center justify-between px-3 font-medium">
                  <span>Displaying live n8n chat UI directly from cloud webhook.</span>
                  <a
                    href={N8N_DIRECT_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold underline text-[#D9826B]"
                  >
                    Open externally
                  </a>
                </div>
                <iframe
                  src={N8N_DIRECT_URL}
                  title="n8n TripRescue AI Chatbot"
                  className="w-full flex-1 border-0"
                  sandbox="allow-forms allow-modals allow-popups allow-same-origin allow-scripts"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
