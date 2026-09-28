import { TripDetails, DisruptionDetails, ItineraryItem } from '../types/travel';

export interface PresetDemo {
  id: string;
  name: string;
  badge: string;
  trip: TripDetails;
  disruption: DisruptionDetails;
  items: ItineraryItem[];
}

export const PRESET_DEMOS: PresetDemo[] = [
  {
    id: 'vizag-hyderabad',
    name: 'Visakhapatnam → Hyderabad',
    badge: 'Recommended Demo',
    trip: {
      origin: 'Visakhapatnam',
      destination: 'Hyderabad',
      travelDate: '2026-09-28',
      transportType: 'Train',
      departureTime: '05:30 AM',
      expectedArrivalTime: '04:00 PM',
      carrierOrNumber: 'Godavari Express · Train #12727',
    },
    disruption: {
      type: 'Delayed',
      durationMinutes: 180,
      durationDisplay: '3 hours',
      currentSituation: 'Train halted due to signal failure and track congestion near Vijayawada junction.',
      notes: 'My train is delayed by 3 hours and I have a hotel check-in at 6 PM and dinner at 8 PM.',
    },
    items: [
      {
        id: 'plan-1',
        time: '6:00 PM',
        activity: 'Hotel check-in',
        location: 'Central Hotel, Banjara Hills',
        type: 'Hotel',
        notes: 'Guaranteed reservation. Hotel policy releases unconfirmed rooms after 6:00 PM.',
      },
      {
        id: 'plan-2',
        time: '8:00 PM',
        activity: 'Dinner with colleagues',
        location: 'Spice Garden Restaurant',
        type: 'Restaurant',
        notes: 'Table for 3 reserved under John. High-demand weekend evening.',
      },
    ],
  },
  {
    id: 'mumbai-delhi',
    name: 'Mumbai → New Delhi',
    badge: 'Flight Delay',
    trip: {
      origin: 'Mumbai (BOM)',
      destination: 'New Delhi (DEL)',
      travelDate: '2026-09-28',
      transportType: 'Flight',
      departureTime: '01:15 PM',
      expectedArrivalTime: '03:30 PM',
      carrierOrNumber: 'IndiGo 6E 2044',
    },
    disruption: {
      type: 'Delayed',
      durationMinutes: 120,
      durationDisplay: '2 hours',
      currentSituation: 'Air traffic control slot restriction and monsoon weather delay at Mumbai departure.',
      notes: 'Flight pushed back by 2 hours. Have an evening client presentation at 5:30 PM and hotel check-in.',
    },
    items: [
      {
        id: 'plan-del-1',
        time: '4:45 PM',
        activity: 'Express Check-in & Bag Drop',
        location: 'The Oberoi, New Delhi',
        type: 'Hotel',
        notes: 'Need 15 min to drop bags and freshen up before presentation.',
      },
      {
        id: 'plan-del-2',
        time: '5:30 PM',
        activity: 'Quarterly Client Presentation',
        location: 'Aerocity Business Hub, Suite 402',
        type: 'Event',
        notes: 'Executive board in attendance; cannot cancel.',
      },
      {
        id: 'plan-del-3',
        time: '8:00 PM',
        activity: 'Networking Dinner',
        location: 'Bukhara at ITC Maurya',
        type: 'Restaurant',
        notes: 'Pre-paid reservation.',
      },
    ],
  },
  {
    id: 'london-edinburgh',
    name: 'London → Edinburgh',
    badge: 'Missed Connection',
    trip: {
      origin: 'London King\'s Cross',
      destination: 'Edinburgh Waverley',
      travelDate: '2026-09-28',
      transportType: 'Train',
      departureTime: '09:00 AM',
      expectedArrivalTime: '01:30 PM',
      carrierOrNumber: 'LNER InterCity 225',
    },
    disruption: {
      type: 'Missed connection',
      durationMinutes: 90,
      durationDisplay: '1 hr 30 min',
      currentSituation: 'Overhead wire issue caused missed connection at York station.',
      notes: 'Missed transfer at York, boarded next available train arriving 90 mins late. Ghost tour booked at 3:00 PM.',
    },
    items: [
      {
        id: 'plan-edi-1',
        time: '2:15 PM',
        activity: 'Guest House Check-in',
        location: 'Old Town Heritage Suites',
        type: 'Hotel',
        notes: 'Self check-in keypad code issued.',
      },
      {
        id: 'plan-edi-2',
        time: '3:00 PM',
        activity: 'Edinburgh Castle & Underground Vaults Tour',
        location: 'Royal Mile Meeting Point',
        type: 'Attraction',
        notes: 'Ticketed group tour; latecomers not admitted.',
      },
    ],
  },
];
