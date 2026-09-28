import React, { useState } from 'react';
import {
  TripDetails,
  DisruptionDetails,
  ItineraryItem,
  TransportType,
  DisruptionType,
  ActivityType,
} from '../types/travel';
import { PRESET_DEMOS } from '../data/presetTrips';
import {
  MapPin,
  Calendar,
  Clock,
  Train,
  Plane,
  Bus,
  Car,
  AlertTriangle,
  Plus,
  Trash2,
  Hotel,
  Utensils,
  Ticket,
  Compass,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  Info,
} from 'lucide-react';

interface TripFormProps {
  trip: TripDetails;
  setTrip: React.Dispatch<React.SetStateAction<TripDetails>>;
  disruption: DisruptionDetails;
  setDisruption: React.Dispatch<React.SetStateAction<DisruptionDetails>>;
  items: ItineraryItem[];
  setItems: React.Dispatch<React.SetStateAction<ItineraryItem[]>>;
  onRescue: () => void;
  isLoading: boolean;
  onSelectPreset: (presetId: string) => void;
  activePresetId: string | null;
}

const TRANSPORT_TYPES: { type: TransportType; label: string; icon: React.ReactNode }[] = [
  { type: 'Train', label: 'Train', icon: <Train className="w-4 h-4" /> },
  { type: 'Flight', label: 'Flight', icon: <Plane className="w-4 h-4" /> },
  { type: 'Bus', label: 'Bus', icon: <Bus className="w-4 h-4" /> },
  { type: 'Other', label: 'Other', icon: <Car className="w-4 h-4" /> },
];

const DISRUPTION_TYPES: DisruptionType[] = [
  'Delayed',
  'Cancelled',
  'Missed connection',
  'Changed schedule',
  'Other',
];

const ACTIVITY_TYPES: { type: ActivityType; label: string; icon: React.ReactNode }[] = [
  { type: 'Hotel', label: 'Hotel', icon: <Hotel className="w-3.5 h-3.5" /> },
  { type: 'Restaurant', label: 'Restaurant', icon: <Utensils className="w-3.5 h-3.5" /> },
  { type: 'Event', label: 'Event', icon: <Ticket className="w-3.5 h-3.5" /> },
  { type: 'Attraction', label: 'Attraction', icon: <Compass className="w-3.5 h-3.5" /> },
  { type: 'Transport', label: 'Transport', icon: <Train className="w-3.5 h-3.5" /> },
  { type: 'Other', label: 'Other', icon: <Info className="w-3.5 h-3.5" /> },
];

export const TripForm: React.FC<TripFormProps> = ({
  trip,
  setTrip,
  disruption,
  setDisruption,
  items,
  setItems,
  onRescue,
  isLoading,
  onSelectPreset,
  activePresetId,
}) => {
  // New item draft state
  const [newItemTime, setNewItemTime] = useState('06:00 PM');
  const [newItemActivity, setNewItemActivity] = useState('');
  const [newItemLocation, setNewItemLocation] = useState('');
  const [newItemType, setNewItemType] = useState<ActivityType>('Hotel');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemActivity.trim()) return;

    const newItem: ItineraryItem = {
      id: `custom-item-${Date.now()}`,
      time: newItemTime.trim() || '06:00 PM',
      activity: newItemActivity.trim(),
      location: newItemLocation.trim() || 'Central',
      type: newItemType,
    };

    setItems([...items, newItem]);
    setNewItemActivity('');
    setNewItemLocation('');
    setShowAddForm(false);
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleDelayPreset = (mins: number, label: string) => {
    setDisruption({
      ...disruption,
      durationMinutes: mins,
      durationDisplay: label,
      notes: disruption.notes || `My ${trip.transportType.toLowerCase()} is delayed by ${label}.`,
    });
  };

  return (
    <div id="trip-recovery-form" className="max-w-4xl mx-auto space-y-6 sm:space-y-8 scroll-mt-24">
      {/* Preset Scenario Selector Bar */}
      <div className="bg-[#FFF8F1] rounded-3xl p-4 sm:p-6 border border-[#FDE8DC] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#FDE8DC]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#D9826B]" />
            <span className="text-sm font-bold text-[#3A3331]">Try Pre-Configured Travel Scenarios</span>
          </div>
          <span className="text-xs text-[#756B66]">Click to instantly populate realistic travel details</span>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {PRESET_DEMOS.map((demo) => {
            const isActive = activePresetId === demo.id;
            return (
              <button
                key={demo.id}
                type="button"
                onClick={() => onSelectPreset(demo.id)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center gap-2 ${
                  isActive
                    ? 'bg-[#FDE8DC] text-[#D9826B] border-[#D9826B] ring-2 ring-[#D9826B]/20 shadow-2xs'
                    : 'bg-white text-[#756B66] border-[#FDE8DC] hover:bg-[#FFF8F1] hover:text-[#3A3331]'
                }`}
              >
                <span>{demo.name}</span>
                <span className="text-[10px] text-[#756B66] font-mono">({demo.disruption.durationDisplay})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Section 2: Trip Details */}
      <div className="bg-[#FFF8F1] rounded-3xl p-5 sm:p-8 border border-[#FDE8DC] shadow-xs">
        <div className="flex items-center justify-between pb-5 border-b border-[#FDE8DC]">
          <div>
            <h2 className="text-xl font-bold text-[#3A3331]">Trip Details</h2>
            <p className="text-sm text-[#756B66] mt-0.5">Your journey origin, destination, and scheduled transit</p>
          </div>
          <div className="text-xs text-[#756B66] font-medium">Step 1 of 3</div>
        </div>

        <div className="mt-6 space-y-6">
          {/* Transport Mode Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#756B66] mb-2">
              Transport Type
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {TRANSPORT_TYPES.map(({ type, label, icon }) => {
                const isSelected = trip.transportType === type;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setTrip({ ...trip, transportType: type })}
                    className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#D9826B] text-white border-[#D9826B] shadow-xs'
                        : 'bg-white text-[#756B66] border-[#FDE8DC] hover:bg-[#FDE8DC]'
                    }`}
                  >
                    {icon}
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Locations */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Starting Location (Origin)
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={trip.origin}
                  onChange={(e) => setTrip({ ...trip, origin: e.target.value })}
                  placeholder="e.g. Visakhapatnam (VSKP)"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#FDE8DC] bg-white focus:outline-none focus:ring-2 focus:ring-[#D9826B] focus:border-transparent text-sm font-medium text-[#3A3331] placeholder:text-[#756B66]/60"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#756B66] mb-1.5">
                Destination
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-[#D9826B]" />
                <input
                  type="text"
                  value={trip.destination}
                  onChange={(e) => setTrip({ ...trip, destination: e.target.value })}
                  placeholder="e.g. Hyderabad (HYB)"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#FDE8DC] bg-white focus:outline-none focus:ring-2 focus:ring-[#D9826B] focus:border-transparent text-sm font-medium text-[#3A3331] placeholder:text-[#756B66]/60"
                  required
                />
              </div>
            </div>
          </div>

          {/* Date & Carrier */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#756B66] mb-1.5">
                Travel Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-3 w-4 h-4 text-[#756B66]" />
                <input
                  type="date"
                  value={trip.travelDate}
                  onChange={(e) => setTrip({ ...trip, travelDate: e.target.value })}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#FDE8DC] bg-white focus:outline-none focus:ring-2 focus:ring-[#D9826B] focus:border-transparent text-sm font-medium text-[#3A3331]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#756B66] mb-1.5">
                Scheduled Departure Time
              </label>
              <div className="relative">
                <Clock className="absolute left-3.5 top-3 w-4 h-4 text-[#756B66]" />
                <input
                  type="text"
                  value={trip.departureTime}
                  onChange={(e) => setTrip({ ...trip, departureTime: e.target.value })}
                  placeholder="e.g. 05:30 AM"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#FDE8DC] bg-white focus:outline-none focus:ring-2 focus:ring-[#D9826B] focus:border-transparent text-sm font-medium text-[#3A3331] font-mono"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#756B66] mb-1.5">
                Expected Arrival Time (Original)
              </label>
              <div className="relative">
                <Clock className="absolute left-3.5 top-3 w-4 h-4 text-[#756B66]" />
                <input
                  type="text"
                  value={trip.expectedArrivalTime}
                  onChange={(e) => setTrip({ ...trip, expectedArrivalTime: e.target.value })}
                  placeholder="e.g. 04:00 PM"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#FDE8DC] bg-white focus:outline-none focus:ring-2 focus:ring-[#D9826B] focus:border-transparent text-sm font-medium text-[#3A3331] font-mono"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Service / Carrier Name & Number <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              value={trip.carrierOrNumber || ''}
              onChange={(e) => setTrip({ ...trip, carrierOrNumber: e.target.value })}
              placeholder="e.g. Godavari Express (Train #12727) or IndiGo 6E 452"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm text-slate-800 placeholder:text-slate-400"
            />
          </div>
        </div>
      </div>

      {/* Section 3: Disruption Details */}
      <div className="bg-[#FFF8F1] rounded-3xl p-5 sm:p-8 border border-[#FDE8DC] shadow-xs">
        <div className="flex items-center justify-between pb-5 border-b border-[#FDE8DC]">
          <div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-[#D9826B]" />
              <h2 className="text-xl font-bold text-[#3A3331]">What went wrong?</h2>
            </div>
            <p className="text-sm text-[#756B66] mt-0.5">Describe the disruption affecting your journey</p>
          </div>
          <div className="text-xs text-[#756B66] font-medium">Step 2 of 3</div>
        </div>

        <div className="mt-6 space-y-6">
          {/* Disruption Type */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#756B66] mb-2">
              Disruption Category
            </label>
            <div className="flex flex-wrap gap-2">
              {DISRUPTION_TYPES.map((type) => {
                const isSelected = disruption.type === type;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setDisruption({ ...disruption, type })}
                    className={`py-2 px-3.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#D9826B] text-white border-[#D9826B] shadow-xs'
                        : 'bg-white text-[#756B66] border-[#FDE8DC] hover:bg-[#FFF8F1]'
                    }`}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Delay Duration */}
          <div>
            <label className="block text-xs font-semibold text-[#756B66] mb-1.5">
              Delay Duration
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={disruption.durationDisplay}
                onChange={(e) => {
                  const val = e.target.value;
                  const numMatch = val.match(/\d+/);
                  const mins = numMatch ? parseInt(numMatch[0], 10) * (val.toLowerCase().includes('hr') || val.toLowerCase().includes('hour') ? 60 : 1) : 180;
                  setDisruption({
                    ...disruption,
                    durationDisplay: val,
                    durationMinutes: mins,
                  });
                }}
                placeholder="e.g. 3 hours or 180 minutes"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#FDE8DC] bg-white focus:outline-none focus:ring-2 focus:ring-[#D9826B] focus:border-transparent text-sm font-medium text-[#3A3331]"
              />

              {/* Quick duration presets */}
              <div className="flex items-center gap-1.5">
                {[
                  { label: '+30m', mins: 30, text: '30 minutes' },
                  { label: '+1 hr', mins: 60, text: '1 hour' },
                  { label: '+2 hrs', mins: 120, text: '2 hours' },
                  { label: '+3 hrs', mins: 180, text: '3 hours' },
                  { label: '+4 hrs', mins: 240, text: '4 hours' },
                ].map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => handleDelayPreset(item.mins, item.text)}
                    className="flex-1 py-2 px-1 text-center rounded-xl bg-white hover:bg-[#FDE8DC] border border-[#FDE8DC] text-xs font-semibold text-[#756B66] hover:text-[#3A3331] cursor-pointer shadow-2xs"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Current Situation */}
          <div>
            <label className="block text-xs font-semibold text-[#756B66] mb-1.5">
              Current Situation / Status
            </label>
            <input
              type="text"
              value={disruption.currentSituation}
              onChange={(e) => setDisruption({ ...disruption, currentSituation: e.target.value })}
              placeholder="e.g. Train halted due to track signal failure near Vijayawada junction"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#FDE8DC] bg-white focus:outline-none focus:ring-2 focus:ring-[#D9826B] focus:border-transparent text-sm text-[#3A3331] placeholder:text-[#756B66]/60"
            />
          </div>

          {/* Natural language description box */}
          <div>
            <label className="block text-xs font-semibold text-[#756B66] mb-1.5">
              Describe the problem naturally
            </label>
            <textarea
              rows={3}
              value={disruption.notes}
              onChange={(e) => setDisruption({ ...disruption, notes: e.target.value })}
              placeholder="Example: My train is delayed by 3 hours and I have a hotel check-in at 6 PM."
              className="w-full px-3.5 py-3 rounded-xl border border-[#FDE8DC] bg-white focus:outline-none focus:ring-2 focus:ring-[#D9826B] focus:border-transparent text-sm text-[#3A3331] placeholder:text-[#756B66]/60 leading-relaxed resize-y"
            />
            <p className="text-xs text-[#756B66] mt-1">
              Mention any commitments, time-critical reservations, or personal preferences.
            </p>
          </div>
        </div>
      </div>

      {/* Section 4: Important Plans */}
      <div className="bg-[#FFF8F1] rounded-3xl p-5 sm:p-8 border border-[#FDE8DC] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-[#FDE8DC] gap-3">
          <div>
            <h2 className="text-xl font-bold text-[#3A3331]">Important Plans & Bookings</h2>
            <p className="text-sm text-[#756B66] mt-0.5">
              Add your scheduled activities, hotel check-ins, or dinner reservations
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowAddForm(!showAddForm)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#D9826B] hover:bg-[#C97863] text-white text-xs font-semibold transition-colors cursor-pointer self-start sm:self-auto shadow-2xs"
          >
            <Plus className="w-4 h-4" />
            <span>{showAddForm ? 'Close Form' : 'Add Activity'}</span>
          </button>
        </div>

        {/* Add Activity Form Drawer */}
        {showAddForm && (
          <form onSubmit={handleAddItem} className="mt-5 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="font-semibold text-xs uppercase tracking-wider text-slate-700">New Itinerary Item</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Time</label>
                <input
                  type="text"
                  value={newItemTime}
                  onChange={(e) => setNewItemTime(e.target.value)}
                  placeholder="e.g. 06:00 PM"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Activity Name</label>
                <input
                  type="text"
                  value={newItemActivity}
                  onChange={(e) => setNewItemActivity(e.target.value)}
                  placeholder="e.g. Hotel check-in"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Location / Venue</label>
                <input
                  type="text"
                  value={newItemLocation}
                  onChange={(e) => setNewItemLocation(e.target.value)}
                  placeholder="e.g. Central Hotel"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#756B66] mb-1.5">Activity Type</label>
              <div className="flex flex-wrap gap-2">
                {ACTIVITY_TYPES.map(({ type, label, icon }) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setNewItemType(type)}
                    className={`flex items-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-semibold border cursor-pointer transition-all ${
                      newItemType === type
                        ? 'bg-[#D9826B] text-white border-[#D9826B] shadow-2xs'
                        : 'bg-white text-[#756B66] border-[#FDE8DC] hover:bg-[#FFF8F1]'
                    }`}
                  >
                    {icon}
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-[#756B66] hover:bg-[#FDE8DC]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-[#D9826B] hover:bg-[#C97863] text-white text-xs font-semibold cursor-pointer shadow-2xs"
              >
                Save Item
              </button>
            </div>
          </form>
        )}

        {/* Existing Items List */}
        <div className="mt-5 space-y-3">
          {items.length === 0 ? (
            <div className="p-8 text-center border-2 border-dashed border-[#FDE8DC] rounded-2xl bg-white/60">
              <p className="text-sm text-[#756B66]">No scheduled activities added yet.</p>
              <button
                type="button"
                onClick={() => setShowAddForm(true)}
                className="mt-2 text-xs font-bold text-[#D9826B] hover:underline"
              >
                Add your hotel check-in or dinner reservation
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-[#FDE8DC] hover:border-[#D9826B]/50 transition-colors shadow-2xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#FDE8DC] text-[#C97863] flex items-center justify-center shrink-0">
                    {item.type === 'Hotel' && <Hotel className="w-4 h-4" />}
                    {item.type === 'Restaurant' && <Utensils className="w-4 h-4" />}
                    {item.type === 'Event' && <Ticket className="w-4 h-4" />}
                    {item.type === 'Attraction' && <Compass className="w-4 h-4" />}
                    {item.type === 'Transport' && <Train className="w-4 h-4" />}
                    {item.type === 'Other' && <Info className="w-4 h-4" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#3A3331] bg-[#FFF8F1] px-2 py-0.5 rounded border border-[#FDE8DC]">
                        {item.time}
                      </span>
                      <span className="text-sm font-bold text-[#3A3331]">{item.activity}</span>
                    </div>
                    {item.location && (
                      <p className="text-xs text-[#756B66] mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#D9826B]" />
                        <span>{item.location}</span>
                        <span className="text-[#FDE8DC]">·</span>
                        <span className="text-[#756B66]">{item.type}</span>
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveItem(item.id)}
                  className="p-1.5 text-[#756B66] hover:text-[#C97863] rounded-lg hover:bg-[#F6D9DC] transition-colors cursor-pointer"
                  aria-label="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Section 5: Rescue Action Card - Soft Warm Terracotta / Coral Style */}
      <div className="bg-[#FFF8F1] rounded-3xl p-6 sm:p-10 border-2 border-[#D9826B]/40 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#FDE8DC] rounded-full blur-3xl pointer-events-none opacity-60" />

        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-[#D9826B] uppercase">
              <span className="w-2 h-2 rounded-full bg-[#D9826B] animate-pulse" />
              <span>Intelligent Itinerary Reconstruction</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#3A3331]">
              Ready to recover your trip?
            </h3>
            <p className="text-sm text-[#756B66] max-w-lg">
              TripRescue will analyze transit delays, flag room and table cancellation risks, and recalculate a seamless recovery plan.
            </p>
          </div>

          <button
            type="button"
            onClick={onRescue}
            disabled={isLoading}
            className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-[#D9826B] hover:bg-[#C97863] active:bg-[#C97863] text-white font-bold text-base shadow-lg shadow-[#D9826B]/25 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed shrink-0"
          >
            <ShieldAlert className="w-5 h-5 text-amber-200" />
            <span>🚨 Rescue My Trip</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
