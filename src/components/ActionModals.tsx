import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  Hotel,
  Utensils,
  Share2,
  Calendar,
  Train,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Info,
  Send,
} from 'lucide-react';
import { RescuePlan, TripDetails } from '../types/travel';

export type ActiveModalType = 
  | 'hotel' 
  | 'restaurant' 
  | 'alternativeTransport' 
  | 'sharePlan' 
  | 'exportCalendar' 
  | null;

interface ActionModalsProps {
  modalType: ActiveModalType;
  onClose: () => void;
  plan: RescuePlan;
  trip: TripDetails;
}

export const ActionModals: React.FC<ActionModalsProps> = ({
  modalType,
  onClose,
  plan,
  trip,
}) => {
  const [copied, setCopied] = useState(false);
  const [sentNotice, setSentNotice] = useState(false);
  const [redirectNotice, setRedirectNotice] = useState<string | null>(null);

  if (!modalType) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulatedSend = () => {
    setSentNotice(true);
    setTimeout(() => {
      setSentNotice(false);
      onClose();
    }, 2200);
  };

  const handleCheckSeats = (operator: string) => {
    setRedirectNotice(`Redirecting to operator booking portal for ${operator} (Direct API Integration Coming Soon).`);
    setTimeout(() => setRedirectNotice(null), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3A3331]/40 backdrop-blur-xs animate-in fade-in">
      <div className="bg-[#FFF8F1] rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-[#FDE8DC] relative max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-[#756B66] hover:text-[#3A3331] hover:bg-[#FDE8DC] transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 1. CONTACT HOTEL MODAL */}
        {modalType === 'hotel' && (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FDE8DC] text-[#C97863] flex items-center justify-center">
                <Hotel className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#3A3331]">Contact Hotel Front Desk</h3>
                <p className="text-xs text-[#756B66]">
                  Late arrival notice draft to safeguard your room reservation
                </p>
              </div>
            </div>

            {/* Product rule badge */}
            <div className="bg-[#FDE8DC]/60 rounded-xl p-3 border border-[#FDE8DC] text-xs text-[#3A3331] flex items-start gap-2">
              <Info className="w-4 h-4 text-[#D9826B] shrink-0 mt-0.5" />
              <div>
                <strong>Notice:</strong> Direct property API dispatch is{' '}
                <span className="font-semibold text-[#D9826B]">Coming Soon</span>. You can copy this pre-composed message to send via WhatsApp, email, or your booking app.
              </div>
            </div>

            {plan.actionCenter.hotelContactDraft ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-[#756B66] mb-1">Subject</label>
                  <input
                    type="text"
                    readOnly
                    value={plan.actionCenter.hotelContactDraft.subject}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#FDE8DC] text-xs font-medium text-[#3A3331]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#756B66] mb-1">Message Body</label>
                  <textarea
                    rows={7}
                    readOnly
                    value={plan.actionCenter.hotelContactDraft.body}
                    className="w-full p-3.5 rounded-xl bg-white border border-[#FDE8DC] text-xs text-[#3A3331] font-mono leading-relaxed resize-none"
                  />
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => handleCopy(plan.actionCenter.hotelContactDraft?.body || '')}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[#FDE8DC] bg-white hover:bg-[#FDE8DC] text-[#3A3331] text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
                  >
                    {copied ? <Check className="w-4 h-4 text-[#D9826B]" /> : <Copy className="w-4 h-4 text-[#756B66]" />}
                    <span>{copied ? 'Copied to Clipboard' : 'Copy Message'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSimulatedSend}
                    disabled={sentNotice}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#D9826B] hover:bg-[#C97863] text-white text-xs font-semibold shadow-sm shadow-[#D9826B]/25 transition-all cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>{sentNotice ? 'Notification Logged ✓' : 'Send Direct Notice'}</span>
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-[#756B66]">No hotel booking in this itinerary.</p>
            )}
          </div>
        )}

        {/* 2. RESCHEDULE RESTAURANT / ACTIVITY MODAL */}
        {modalType === 'restaurant' && (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F6D9DC] text-[#C97863] flex items-center justify-center">
                <Utensils className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#3A3331]">Reschedule Activity / Reservation</h3>
                <p className="text-xs text-[#756B66]">
                  Pre-drafted dining adjustment request to hold your table
                </p>
              </div>
            </div>

            <div className="bg-[#FDE8DC]/60 rounded-xl p-3 border border-[#FDE8DC] text-xs text-[#3A3331] flex items-start gap-2">
              <Info className="w-4 h-4 text-[#D9826B] shrink-0 mt-0.5" />
              <div>
                <strong>Notice:</strong> Reservation sync is{' '}
                <span className="font-semibold text-[#D9826B]">Coming Soon</span>. You can copy this message to text the restaurant or call the host.
              </div>
            </div>

            {plan.actionCenter.restaurantRescheduleDraft ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-[#756B66] mb-1">Subject</label>
                  <input
                    type="text"
                    readOnly
                    value={plan.actionCenter.restaurantRescheduleDraft.subject}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#FDE8DC] text-xs font-medium text-[#3A3331]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#756B66] mb-1">Message Body</label>
                  <textarea
                    rows={6}
                    readOnly
                    value={plan.actionCenter.restaurantRescheduleDraft.body}
                    className="w-full p-3.5 rounded-xl bg-white border border-[#FDE8DC] text-xs text-[#3A3331] font-mono leading-relaxed resize-none"
                  />
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => handleCopy(plan.actionCenter.restaurantRescheduleDraft?.body || '')}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[#FDE8DC] bg-white hover:bg-[#FDE8DC] text-[#3A3331] text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
                  >
                    {copied ? <Check className="w-4 h-4 text-[#D9826B]" /> : <Copy className="w-4 h-4 text-[#756B66]" />}
                    <span>{copied ? 'Copied to Clipboard' : 'Copy Message'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSimulatedSend}
                    disabled={sentNotice}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#D9826B] hover:bg-[#C97863] text-white text-xs font-semibold transition-all cursor-pointer shadow-sm shadow-[#D9826B]/25"
                  >
                    {sentNotice ? (
                      <span className="flex items-center gap-1.5 text-white">
                        <Check className="w-4 h-4" /> Request Sent!
                      </span>
                    ) : (
                      <span>Request Time Adjustment</span>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-[#756B66]">No restaurant reservation detected in this itinerary.</p>
            )}
          </div>
        )}

        {/* 3. ALTERNATIVE TRANSPORT MODAL */}
        {modalType === 'alternativeTransport' && (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#E9DDF2] text-[#756B66] flex items-center justify-center">
                <Train className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#3A3331]">Alternative Transport Options</h3>
                <p className="text-xs text-[#756B66]">
                  Evaluated options between {trip.origin} and {trip.destination}
                </p>
              </div>
            </div>

            <div className="bg-[#FFF8F1] rounded-2xl p-3.5 border border-[#FDE8DC] text-xs text-[#756B66] flex items-start gap-2">
              <Info className="w-4 h-4 text-[#D9826B] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#3A3331]">AI Market Scan:</strong> Showing realistic alternative connections. Direct instant booking checkout will be activated with GDS API connection.
              </div>
            </div>

            {redirectNotice && (
              <div className="bg-[#FDE8DC] border border-[#FDE8DC] text-[#3A3331] rounded-2xl p-3 text-xs flex items-center gap-2 animate-in fade-in">
                <Sparkles className="w-4 h-4 text-[#D9826B] shrink-0" />
                <span>{redirectNotice}</span>
              </div>
            )}

            <div className="space-y-3">
              {plan.actionCenter.alternativeTransports.map((alt) => (
                <div
                  key={alt.id}
                  className="p-4 rounded-2xl bg-white border border-[#FDE8DC] hover:border-[#D9826B] hover:shadow-xs transition-all space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#FDE8DC] text-[#3A3331]">
                        {alt.mode}
                      </span>
                      <span className="text-xs font-bold text-[#3A3331]">{alt.operator}</span>
                    </div>
                    <span className="text-xs font-bold text-[#D9826B] font-mono">{alt.estimatedCost}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-[#756B66]">
                    <span>{alt.departure}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#D9826B]" />
                    <span className="font-semibold text-[#3A3331]">{alt.arrival}</span>
                  </div>

                  <p className="text-xs text-[#756B66] pt-1 border-t border-[#FDE8DC]">{alt.tradeoff}</p>

                  <div className="pt-1 flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-[#3A3331] flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#DCE8D5]" />
                      {alt.status}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCheckSeats(alt.operator)}
                      className="text-xs font-semibold text-[#D9826B] hover:text-[#C97863] flex items-center gap-1 cursor-pointer"
                    >
                      <span>Check Seats</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. SHARE PLAN MODAL */}
        {modalType === 'sharePlan' && (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FDE8DC] text-[#D9826B] flex items-center justify-center">
                <Share2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#3A3331]">Share Recovery Plan</h3>
                <p className="text-xs text-[#756B66]">
                  Send updated arrival details to family, colleagues, or drivers
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-semibold text-[#756B66]">Quick Share Summary</label>
              <textarea
                rows={7}
                readOnly
                value={`🚨 Trip Update (${trip.origin} → ${trip.destination})
Status: Delayed by ${plan.tripStatus.delayDisplay}
New Expected Arrival: ${plan.tripStatus.newExpectedArrival} (Original: ${plan.tripStatus.originalArrival})

Revised Itinerary:
${plan.updatedItinerary.map((i) => `• ${i.time} - ${i.activity} (${i.location})`).join('\n')}

Generated via TripRescue AI`}
                className="w-full p-3.5 rounded-2xl bg-white border border-[#FDE8DC] text-xs text-[#3A3331] font-mono leading-relaxed resize-none"
              />

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() =>
                    handleCopy(`🚨 Trip Update (${trip.origin} → ${trip.destination})\nStatus: Delayed by ${plan.tripStatus.delayDisplay}\nNew Expected Arrival: ${plan.tripStatus.newExpectedArrival}\n\n${plan.updatedItinerary.map((i) => `• ${i.time} - ${i.activity}`).join('\n')}`)
                  }
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D9826B] hover:bg-[#C97863] text-white text-xs font-semibold shadow-sm shadow-[#D9826B]/25 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copied Link & Summary' : 'Copy Summary'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 5. EXPORT / UPDATE ITINERARY MODAL */}
        {modalType === 'exportCalendar' && (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#DCE8D5] text-[#3A3331] flex items-center justify-center">
                <Calendar className="w-5 h-5 text-[#3A3331]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#3A3331]">Update & Export Itinerary</h3>
                <p className="text-xs text-[#756B66]">
                  Sync the revised timeline with Google Calendar, Apple Calendar, or Outlook
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-xs text-[#756B66] leading-relaxed">
                Download a universal <strong>.ICS calendar file</strong> containing all revised schedule times, hotel check-in buffers, and venue addresses.
              </p>

              <div className="p-4 rounded-2xl bg-white border border-[#FDE8DC] space-y-2 text-xs">
                <div className="font-semibold text-[#3A3331]">Included In Sync:</div>
                <div className="space-y-1 text-[#756B66]">
                  <div>✓ {plan.tripStatus.newExpectedArrival} - Arrival in {trip.destination}</div>
                  {plan.updatedItinerary.map((i) => (
                    <div key={i.id}>✓ {i.time} - {i.activity} ({i.status})</div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    const icsContent = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//TripRescue AI//EN\n${plan.updatedItinerary
                      .map(
                        (i) =>
                          `BEGIN:VEVENT\nSUMMARY:${i.activity}\nDESCRIPTION:${i.rationale}\nLOCATION:${i.location}\nEND:VEVENT`
                      )
                      .join('\n')}\nEND:VCALENDAR`;
                    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', `TripRescue-${trip.destination}.ics`);
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#D9826B] hover:bg-[#C97863] text-white text-xs font-semibold shadow-sm shadow-[#D9826B]/25 cursor-pointer"
                >
                  <Calendar className="w-4 h-4 text-white" />
                  <span>Download .ICS Calendar File</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleCopy(JSON.stringify(plan.updatedItinerary, null, 2))}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[#FDE8DC] bg-white hover:bg-[#FDE8DC] text-[#3A3331] text-xs font-semibold cursor-pointer shadow-2xs"
                >
                  {copied ? <Check className="w-4 h-4 text-[#D9826B]" /> : <Copy className="w-4 h-4 text-[#756B66]" />}
                  <span>{copied ? 'Copied JSON' : 'Copy JSON'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
