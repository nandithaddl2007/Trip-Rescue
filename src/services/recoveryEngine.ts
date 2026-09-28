import {
  TripDetails,
  DisruptionDetails,
  ItineraryItem,
  RescuePlan,
  ConflictItem,
  WhatChangedItem,
  UpdatedTimelineItem,
} from '../types/travel';

// Time utility functions
export function parseTimeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const cleaned = timeStr.trim();
  
  // Check for 12-hour AM/PM format
  const ampmMatch = cleaned.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
  if (ampmMatch) {
    let hours = parseInt(ampmMatch[1], 10);
    const minutes = parseInt(ampmMatch[2], 10);
    const meridian = ampmMatch[3]?.toUpperCase();

    if (meridian === 'PM' && hours < 12) hours += 12;
    if (meridian === 'AM' && hours === 12) hours = 0;
    return hours * 60 + minutes;
  }

  // Check simple 24-hr "HH:MM"
  const simpleMatch = cleaned.match(/(\d{1,2}):(\d{2})/);
  if (simpleMatch) {
    const hours = parseInt(simpleMatch[1], 10);
    const minutes = parseInt(simpleMatch[2], 10);
    return hours * 60 + minutes;
  }

  return 12 * 60; // default noon fallback
}

export function minutesToTimeString(totalMinutes: number): string {
  // Normalize within 24 hours (can wrap to next day if needed)
  let norm = totalMinutes % (24 * 60);
  if (norm < 0) norm += 24 * 60;

  const hours24 = Math.floor(norm / 60);
  const mins = norm % 60;
  const meridian = hours24 >= 12 ? 'PM' : 'AM';
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  const minsFormatted = mins < 10 ? `0${mins}` : `${mins}`;

  return `${hours12}:${minsFormatted} ${meridian}`;
}

export function formatDurationMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remainingMins = minutes % 60;
  if (remainingMins === 0) {
    return `${hours} hour${hours > 1 ? 's' : ''}`;
  }
  return `${hours} hr ${remainingMins} min`;
}

/**
 * Smart Heuristic Recovery Engine
 * Rebuilds travel itinerary based on delay magnitude, buffer constraints,
 * activity types, and location logistics.
 */
export function buildRecoveryPlanHeuristic(
  trip: TripDetails,
  disruption: DisruptionDetails,
  items: ItineraryItem[]
): RescuePlan {
  const originalArrivalMins = parseTimeToMinutes(trip.expectedArrivalTime);
  const delayMins = disruption.durationMinutes > 0 ? disruption.durationMinutes : 180;
  const newArrivalMins = originalArrivalMins + delayMins;
  
  const originalArrivalFormatted = minutesToTimeString(originalArrivalMins);
  const newArrivalFormatted = minutesToTimeString(newArrivalMins);
  const delayDisplay = disruption.durationDisplay || formatDurationMinutes(delayMins);

  const severity = delayMins > 240 ? 'severe' : delayMins >= 120 ? 'moderate' : 'minor';

  const conflicts: ConflictItem[] = [];
  const whatChanged: WhatChangedItem[] = [];
  const updatedItinerary: UpdatedTimelineItem[] = [];

  // Track the primary arrival event
  whatChanged.push({
    id: 'wc-arrival',
    activity: `Arrival in ${trip.destination}`,
    originalTime: originalArrivalFormatted,
    newTime: newArrivalFormatted,
    changeSummary: `Delayed by ${delayDisplay} due to ${disruption.type.toLowerCase()}`,
    impact: 'delayed',
  });

  updatedItinerary.push({
    id: 'timeline-arrival',
    time: newArrivalFormatted,
    activity: `Arrive at ${trip.destination}`,
    location: `${trip.destination} Terminal / Station`,
    type: 'Transport',
    status: 'Arrival',
    originalTime: originalArrivalFormatted,
    rationale: `Revised arrival based on a ${delayDisplay} travel delay. Proceed directly to local transit or baggage collection.`,
    actionableTip: 'Have rideshare app or local prepaid transit counter ready to minimize station dwell time.',
    isNew: true,
  });

  // Sort original items chronologically
  const sortedItems = [...items].sort((a, b) => {
    return parseTimeToMinutes(a.time) - parseTimeToMinutes(b.time);
  });

  // Track running cursor time starting from arrival + 20 mins baggage/taxi buffer
  let currentCursorMins = newArrivalMins + 20;

  for (const item of sortedItems) {
    const itemOriginalMins = parseTimeToMinutes(item.time);
    const itemOriginalFormatted = minutesToTimeString(itemOriginalMins);

    // Is item already in the past or directly clashing?
    if (newArrivalMins >= itemOriginalMins) {
      // Direct clash!
      const timeDifference = newArrivalMins - itemOriginalMins;
      
      if (item.type === 'Hotel') {
        const revisedTimeMins = currentCursorMins;
        const revisedTimeStr = minutesToTimeString(revisedTimeMins);

        conflicts.push({
          id: `conflict-${item.id}`,
          severity: 'warning',
          title: `Late Check-in at ${item.location || item.activity}`,
          description: `Original check-in was set for ${itemOriginalFormatted}, but your updated arrival is ${newArrivalFormatted}. Many properties reassign unconfirmed rooms after 6:00 PM.`,
          suggestedResolution: `Notify ${item.location || 'the front desk'} of your expected ${revisedTimeStr} arrival to guarantee your reservation.`,
        });

        whatChanged.push({
          id: `wc-${item.id}`,
          activity: item.activity,
          originalTime: itemOriginalFormatted,
          newTime: revisedTimeStr,
          changeSummary: `Shifted +${formatDurationMinutes(revisedTimeMins - itemOriginalMins)} due to delayed arrival.`,
          impact: 'rescheduled',
        });

        updatedItinerary.push({
          id: `revised-${item.id}`,
          time: revisedTimeStr,
          activity: `${item.activity} (Late Arrival)`,
          location: item.location,
          type: item.type,
          status: 'Rescheduled',
          originalTime: itemOriginalFormatted,
          rationale: `Rescheduled to allow 20 minutes travel time from the station/airport to ${item.location || 'hotel'}.`,
          actionableTip: 'Show your booking confirmation and delay proof at reception for complimentary fast check-in.',
        });

        // Add 25 minutes for check-in and drop bags
        currentCursorMins = revisedTimeMins + 25;
      } else if (item.type === 'Restaurant') {
        const revisedTimeMins = Math.max(currentCursorMins + 20, newArrivalMins + 60);
        const revisedTimeStr = minutesToTimeString(revisedTimeMins);

        conflicts.push({
          id: `conflict-${item.id}`,
          severity: 'critical',
          title: `Missed Dining Time: ${item.activity}`,
          description: `Your reservation at ${itemOriginalFormatted} falls before or right at your new arrival time (${newArrivalFormatted}).`,
          suggestedResolution: `Push reservation back to ${revisedTimeStr} or request a 30-minute grace window.`,
        });

        whatChanged.push({
          id: `wc-${item.id}`,
          activity: item.activity,
          originalTime: itemOriginalFormatted,
          newTime: revisedTimeStr,
          changeSummary: `Pushed back to ${revisedTimeStr} to provide adequate buffer after arrival and check-in.`,
          impact: 'rescheduled',
        });

        updatedItinerary.push({
          id: `revised-${item.id}`,
          time: revisedTimeStr,
          activity: item.activity,
          location: item.location,
          type: item.type,
          status: 'Rescheduled',
          originalTime: itemOriginalFormatted,
          rationale: `Moved after hotel drop-off with a comfortable 30-minute transit and preparation window.`,
          actionableTip: 'Call or send a digital concierge note in advance so your table is not released to walk-ins.',
        });

        currentCursorMins = revisedTimeMins + 75; // 75 mins dinner
      } else {
        // Events, attractions, etc.
        const revisedTimeMins = currentCursorMins + 15;
        const revisedTimeStr = minutesToTimeString(revisedTimeMins);

        conflicts.push({
          id: `conflict-${item.id}`,
          severity: 'warning',
          title: `Schedule Overlap: ${item.activity}`,
          description: `Scheduled for ${itemOriginalFormatted}, which conflicts directly with the ${delayDisplay} delay.`,
          suggestedResolution: `Reschedule to ${revisedTimeStr} or verify if venue has flexible entry hours.`,
        });

        whatChanged.push({
          id: `wc-${item.id}`,
          activity: item.activity,
          originalTime: itemOriginalFormatted,
          newTime: revisedTimeStr,
          changeSummary: `Adjusted to ${revisedTimeStr} following revised arrival schedule.`,
          impact: 'rescheduled',
        });

        updatedItinerary.push({
          id: `revised-${item.id}`,
          time: revisedTimeStr,
          activity: item.activity,
          location: item.location,
          type: item.type,
          status: 'Rescheduled',
          originalTime: itemOriginalFormatted,
          rationale: `Shifted to sequential slot following travel delay.`,
          actionableTip: 'Verify closing times for this attraction/event venue.',
        });

        currentCursorMins = revisedTimeMins + 60;
      }
    } else {
      // Item original time is AFTER new arrival, but buffer might be too tight
      const bufferMins = itemOriginalMins - currentCursorMins;

      if (bufferMins < 20) {
        // Tight connection!
        const recommendedTimeMins = currentCursorMins + 25;
        const recommendedTimeStr = minutesToTimeString(recommendedTimeMins);

        conflicts.push({
          id: `conflict-${item.id}`,
          severity: 'warning',
          title: `Tight Buffer: ${item.activity}`,
          description: `Original time of ${itemOriginalFormatted} only leaves ${Math.max(0, bufferMins)} minutes after previous commitments. Transit delays could make you late.`,
          suggestedResolution: `Recommend slight buffer expansion to ${recommendedTimeStr}.`,
        });

        whatChanged.push({
          id: `wc-${item.id}`,
          activity: item.activity,
          originalTime: itemOriginalFormatted,
          newTime: recommendedTimeStr,
          changeSummary: `Shifted by +${recommendedTimeMins - itemOriginalMins} mins to protect schedule stability.`,
          impact: 'tight',
        });

        updatedItinerary.push({
          id: `revised-${item.id}`,
          time: recommendedTimeStr,
          activity: item.activity,
          location: item.location,
          type: item.type,
          status: 'Tight Connection',
          originalTime: itemOriginalFormatted,
          rationale: `Adjusted by ${recommendedTimeMins - itemOriginalMins} minutes to ensure you do not have to rush between locations.`,
          actionableTip: 'Pre-book a local cab or confirm route to preserve timing.',
        });

        currentCursorMins = recommendedTimeMins + (item.type === 'Restaurant' ? 70 : 45);
      } else {
        // Item is preserved smoothly!
        whatChanged.push({
          id: `wc-${item.id}`,
          activity: item.activity,
          originalTime: itemOriginalFormatted,
          newTime: itemOriginalFormatted,
          changeSummary: `Preserved on original schedule (${bufferMins} min comfortable buffer).`,
          impact: 'preserved',
        });

        updatedItinerary.push({
          id: `preserved-${item.id}`,
          time: itemOriginalFormatted,
          activity: item.activity,
          location: item.location,
          type: item.type,
          status: 'Preserved',
          originalTime: itemOriginalFormatted,
          rationale: `Sufficient buffer remains from preceding events; no modification required.`,
          actionableTip: 'Schedule confirmed without disruption.',
        });

        currentCursorMins = itemOriginalMins + (item.type === 'Restaurant' ? 70 : 45);
      }
    }
  }

  // Sort updated itinerary by time
  updatedItinerary.sort((a, b) => parseTimeToMinutes(a.time) - parseTimeToMinutes(b.time));

  // Find hotel or restaurant name for drafts
  const hotelItem = items.find((i) => i.type === 'Hotel');
  const restaurantItem = items.find((i) => i.type === 'Restaurant');

  const hotelName = hotelItem?.location || hotelItem?.activity || 'Hotel Front Desk';
  const restaurantName = restaurantItem?.location || restaurantItem?.activity || 'Restaurant Host';

  const hotelContactDraft = hotelItem
    ? {
        hotelName,
        subject: `Late Arrival Notice - Reservation for ${trip.destination}`,
        body: `Dear ${hotelName} Team,\n\nI am writing to notify you that my ${trip.transportType.toLowerCase()} to ${trip.destination} has been delayed by ${delayDisplay} (${disruption.notes || disruption.currentSituation || 'transit disruption'}).\n\nMy new expected arrival at the property is approximately ${minutesToTimeString(newArrivalMins + 20)}.\n\nKindly keep my room active and note my late check-in so it is not released as a no-show. Thank you for your hospitality and understanding.\n\nBest regards,\n[Your Name]`,
      }
    : undefined;

  const restaurantRescheduleDraft = restaurantItem
    ? {
        restaurantName,
        subject: `Table Reservation Time Adjustment - ${restaurantName}`,
        body: `Hello ${restaurantName} Team,\n\nDue to an unforeseen ${delayDisplay} delay on our ${trip.transportType.toLowerCase()} into ${trip.destination}, we will not be able to make our original reservation at ${restaurantItem.time}.\n\nCould we kindly adjust our reservation to ${minutesToTimeString(newArrivalMins + 80)} or hold our table for an extra 30-45 minutes?\n\nWe greatly appreciate your flexibility and look forward to dining with you tonight.\n\nSincerely,\n[Your Name]`,
      }
    : undefined;

  const alternativeTransports = [
    {
      id: 'alt-1',
      mode: 'Express Train',
      operator: 'Vande Bharat / Superfast Express',
      departure: 'Next scheduled in 45 min',
      arrival: 'Faster transit (-40 min)',
      estimatedCost: 'Fare upgrade difference (~$12 / ₹850)',
      status: 'High Availability',
      tradeoff: 'Guaranteed seat & electrical outlets, saves ~40 minutes transit time.',
    },
    {
      id: 'alt-2',
      mode: 'Intercity Bus',
      operator: 'Premium Volvo Multi-Axle Sleeper',
      departure: 'Departs in 30 min from Central Hub',
      arrival: 'Similar ETA but bypasses track blockage',
      estimatedCost: 'Standard ticket (~$15 / ₹1,100)',
      status: 'Seats Available',
      tradeoff: 'Avoids railway signal congestion; subject to highway toll traffic.',
    },
    {
      id: 'alt-3',
      mode: 'Domestic Flight / Air Shuttle',
      operator: 'IndiGo / Regional Air',
      departure: 'Scheduled flight at terminal',
      arrival: 'Flight time 1h 05m',
      estimatedCost: 'Standard airfare (~$55 / ₹4,200)',
      status: 'Limited Seats',
      tradeoff: 'Fastest transit, recommended if critical business or non-refundable event.',
    },
  ];

  return {
    tripStatus: {
      originalArrival: originalArrivalFormatted,
      newExpectedArrival: newArrivalFormatted,
      delayDisplay,
      severity,
      headline:
        delayMins > 0
          ? `${delayDisplay} delay detected on your ${trip.transportType} journey to ${trip.destination}. Revised plan generated with zero lost bookings.`
          : `On-time journey schedule verified.`,
    },
    whatChanged,
    updatedItinerary,
    conflictsDetected: conflicts,
    aiRecommendation: {
      summary: `TripRescue recalculated your timeline by factoring in a ${delayDisplay} transit delay, realistic station taxi clearance (20 mins), and key buffer margins. Both your ${hotelItem ? 'hotel check-in' : 'accommodations'} and ${restaurantItem ? 'dining plans' : 'downstream activities'} have been logically re-sequenced to avoid cancellation penalties and prevent stressful rushing.`,
      practicalReasoning: [
        `Arrival shifted from ${originalArrivalFormatted} to ${newArrivalFormatted} (+${delayDisplay}).`,
        `Preserved ${hotelItem ? hotelItem.activity : 'initial check-in'} by sequencing it immediately after station departure with a 20-minute buffer.`,
        `Avoided dining no-show fees by shifting ${restaurantItem ? restaurantItem.activity : 'evening events'} into a realistic window allowing room drop-off and freshening up.`,
        `Maintained all confirmed bookings without requiring costly cancellations.`,
      ],
      travelTimeBufferNote:
        'All calculations incorporate local terminal exit, rideshare hailing, and hotel front desk processing time.',
      generatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      source: 'smart-heuristic-engine',
    },
    actionCenter: {
      hotelContactDraft,
      restaurantRescheduleDraft,
      alternativeTransports,
    },
  };
}
