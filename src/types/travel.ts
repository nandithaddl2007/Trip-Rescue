export type TransportType = 'Flight' | 'Train' | 'Bus' | 'Other';

export type DisruptionType = 
  | 'Delayed' 
  | 'Cancelled' 
  | 'Missed connection' 
  | 'Changed schedule' 
  | 'Other';

export type ActivityType = 
  | 'Hotel' 
  | 'Restaurant' 
  | 'Event' 
  | 'Attraction' 
  | 'Transport' 
  | 'Other';

export interface TripDetails {
  origin: string;
  destination: string;
  travelDate: string;
  transportType: TransportType;
  departureTime: string;
  expectedArrivalTime: string;
  carrierOrNumber?: string;
}

export interface DisruptionDetails {
  type: DisruptionType;
  durationMinutes: number;
  durationDisplay: string;
  currentSituation: string;
  notes: string;
}

export interface ItineraryItem {
  id: string;
  time: string;
  activity: string;
  location: string;
  type: ActivityType;
  notes?: string;
}

export interface WhatChangedItem {
  id: string;
  activity: string;
  originalTime: string;
  newTime: string;
  changeSummary: string;
  impact: 'rescheduled' | 'delayed' | 'tight' | 'cancelled' | 'preserved';
}

export interface UpdatedTimelineItem {
  id: string;
  time: string;
  activity: string;
  location: string;
  type: ActivityType;
  status: 'On Time' | 'Rescheduled' | 'Tight Connection' | 'Arrival' | 'Preserved' | 'Action Needed';
  originalTime?: string;
  rationale: string;
  actionableTip?: string;
  isNew?: boolean;
}

export interface ConflictItem {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  suggestedResolution: string;
}

export interface RescuePlan {
  tripStatus: {
    originalArrival: string;
    newExpectedArrival: string;
    delayDisplay: string;
    severity: 'minor' | 'moderate' | 'severe';
    headline: string;
  };
  whatChanged: WhatChangedItem[];
  updatedItinerary: UpdatedTimelineItem[];
  conflictsDetected: ConflictItem[];
  aiRecommendation: {
    summary: string;
    practicalReasoning: string[];
    travelTimeBufferNote: string;
    generatedAt: string;
    source: 'gemini-ai' | 'smart-heuristic-engine';
  };
  actionCenter: {
    hotelContactDraft?: {
      hotelName: string;
      subject: string;
      body: string;
    };
    restaurantRescheduleDraft?: {
      restaurantName: string;
      subject: string;
      body: string;
    };
    alternativeTransports: Array<{
      id: string;
      mode: string;
      operator: string;
      departure: string;
      arrival: string;
      estimatedCost: string;
      status: string;
      tradeoff: string;
    }>;
  };
}
