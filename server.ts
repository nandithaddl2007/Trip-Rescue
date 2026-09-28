import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { TripDetails, DisruptionDetails, ItineraryItem, RescuePlan } from './src/types/travel';
import { buildRecoveryPlanHeuristic } from './src/services/recoveryEngine';

dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());

// Initialize server-side Gemini client
const getAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

app.post('/api/rescue', async (req: Request, res: Response) => {
  const { trip, disruption, items }: { trip: TripDetails; disruption: DisruptionDetails; items: ItineraryItem[] } = req.body;

  if (!trip || !disruption) {
    return res.status(400).json({ error: 'Missing trip or disruption details' });
  }

  const ai = getAI();

  if (ai) {
    try {
      const prompt = `You are TripRescue AI, an expert travel recovery intelligence system.
Analyze this travel disruption and rebuild a practical, realistic itinerary:

TRIP DETAILS:
- Origin: ${trip.origin}
- Destination: ${trip.destination}
- Date: ${trip.travelDate}
- Mode: ${trip.transportType} ${trip.carrierOrNumber ? `(${trip.carrierOrNumber})` : ''}
- Scheduled Departure: ${trip.departureTime}
- Scheduled Arrival: ${trip.expectedArrivalTime}

DISRUPTION DETAILS:
- Disruption Type: ${disruption.type}
- Delay Duration: ${disruption.durationDisplay || disruption.durationMinutes + ' minutes'}
- Current Situation: ${disruption.currentSituation || 'None specified'}
- Traveler Notes: ${disruption.notes || 'None'}

EXISTING COMMITMENTS / ITINERARY:
${items && items.length > 0 ? items.map((it, idx) => `${idx + 1}. [${it.type}] ${it.time} - ${it.activity} at ${it.location || 'Local'}`).join('\n') : 'No pre-existing activities'}

RECOVERY RULES:
1. Recalculate new expected arrival time in ${trip.destination} accurately based on scheduled arrival and delay duration.
2. Evaluate every commitment against the new arrival time. Account for 20-30 min transfer buffer from terminal.
3. If an activity is missed or has too tight a buffer (<20 min), reschedule it logically.
4. Explain clearly what changed (old vs new time) and why.
5. Provide specific, practical warnings for affected bookings (e.g. hotel holding room, dinner table release).
6. Provide ready-to-use communication drafts (e.g., late check-in note for hotel, table adjustment for restaurant).
7. Suggest alternative transport options if relevant.
8. Clearly label all output as AI-generated recovery suggestions.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction:
            'You are TripRescue AI, a travel logistics AI assistant. Return strictly valid JSON adhering to the provided schema.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              tripStatus: {
                type: Type.OBJECT,
                properties: {
                  originalArrival: { type: Type.STRING },
                  newExpectedArrival: { type: Type.STRING },
                  delayDisplay: { type: Type.STRING },
                  severity: { type: Type.STRING, enum: ['minor', 'moderate', 'severe'] },
                  headline: { type: Type.STRING },
                },
                required: ['originalArrival', 'newExpectedArrival', 'delayDisplay', 'severity', 'headline'],
              },
              whatChanged: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    activity: { type: Type.STRING },
                    originalTime: { type: Type.STRING },
                    newTime: { type: Type.STRING },
                    changeSummary: { type: Type.STRING },
                    impact: { type: Type.STRING, enum: ['rescheduled', 'delayed', 'tight', 'cancelled', 'preserved'] },
                  },
                  required: ['id', 'activity', 'originalTime', 'newTime', 'changeSummary', 'impact'],
                },
              },
              updatedItinerary: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    time: { type: Type.STRING },
                    activity: { type: Type.STRING },
                    location: { type: Type.STRING },
                    type: { type: Type.STRING, enum: ['Hotel', 'Restaurant', 'Event', 'Attraction', 'Transport', 'Other'] },
                    status: {
                      type: Type.STRING,
                      enum: ['On Time', 'Rescheduled', 'Tight Connection', 'Arrival', 'Preserved', 'Action Needed'],
                    },
                    originalTime: { type: Type.STRING },
                    rationale: { type: Type.STRING },
                    actionableTip: { type: Type.STRING },
                  },
                  required: ['id', 'time', 'activity', 'location', 'type', 'status', 'rationale'],
                },
              },
              conflictsDetected: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    severity: { type: Type.STRING, enum: ['critical', 'warning', 'info'] },
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                    suggestedResolution: { type: Type.STRING },
                  },
                  required: ['id', 'severity', 'title', 'description', 'suggestedResolution'],
                },
              },
              aiRecommendation: {
                type: Type.OBJECT,
                properties: {
                  summary: { type: Type.STRING },
                  practicalReasoning: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  travelTimeBufferNote: { type: Type.STRING },
                },
                required: ['summary', 'practicalReasoning', 'travelTimeBufferNote'],
              },
            },
            required: ['tripStatus', 'whatChanged', 'updatedItinerary', 'conflictsDetected', 'aiRecommendation'],
          },
        },
      });

      const parsedText = response.text ? JSON.parse(response.text.trim()) : null;
      if (parsedText && parsedText.tripStatus) {
        // Complement with action center templates
        const heuristicBase = buildRecoveryPlanHeuristic(trip, disruption, items || []);
        const completePlan: RescuePlan = {
          ...parsedText,
          aiRecommendation: {
            ...parsedText.aiRecommendation,
            generatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            source: 'gemini-ai',
          },
          actionCenter: heuristicBase.actionCenter,
        };
        return res.json(completePlan);
      }
    } catch (err) {
      console.warn('Gemini API call failed, falling back to smart heuristic recovery engine:', err);
    }
  }

  // Fallback to high-precision heuristic recovery engine
  const plan = buildRecoveryPlanHeuristic(trip, disruption, items || []);
  return res.json(plan);
});

// Proxy endpoint for n8n AI Chat webhook to prevent browser CORS and iframe issues
app.post('/api/chat', async (req: Request, res: Response) => {
  const { message, sessionId, chatHistory } = req.body;
  const n8nWebhookUrl = 'https://ndthequeen.app.n8n.cloud/webhook/9599e7a0-8f37-47d4-97ee-00cbef98f6c6/chat';

  try {
    const payload = {
      chatInput: message,
      action: 'sendMessage',
      sessionId: sessionId || 'trip-rescue-session-' + Date.now(),
      message,
      chatHistory,
    };

    const response = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/plain, */*',
      },
      body: JSON.stringify(payload),
    });

    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const data = await response.json();
      return res.json(data);
    } else {
      const text = await response.text();
      return res.json({ output: text });
    }
  } catch (error: any) {
    console.error('Error forwarding to n8n webhook:', error);
    return res.status(502).json({
      error: 'Failed to communicate with n8n chatbot',
      details: error.message,
    });
  }
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`TripRescue AI server running at http://0.0.0.0:${port}`);
  });
}

startServer();
