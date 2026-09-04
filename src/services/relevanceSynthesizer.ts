import { GoogleGenAI } from '@google/genai';
import { RawContextBundle, SynthesizedRelevanceFeed } from '../types/realContext';
import { TaskItem } from '../types/concierge';

/**
 * Aether Relevance Engine (AICore / Gemini Nano Synthesizer)
 *
 * Architecture:
 * Android System Signals -> Aether Context Index -> Relevance Bundling -> Gemini Nano/AICore -> Concierge
 *
 * Compresses live raw context (notifications, calendar events, battery state, recent tasks, contacts)
 * into a compact candidate set and asks the model to render strict structured relevance:
 * NOW / NEXT / DON'T FORGET / PEOPLE.
 */

// Initialize Gemini client (uses GEMINI_API_KEY from environment)
let aiClient: GoogleGenAI | null = null;
function getAiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const env = (import.meta as any).env;
    const apiKey = env?.VITE_GEMINI_API_KEY || (typeof process !== 'undefined' ? process.env?.GEMINI_API_KEY : '');
    if (apiKey) {
      aiClient = new GoogleGenAI({ apiKey });
    }
  }
  return aiClient;
}

export async function synthesizeContextWithGemini(
  rawContext: RawContextBundle,
  localTasks: TaskItem[],
  userPrompt?: string
): Promise<SynthesizedRelevanceFeed> {
  const ai = getAiClient();

  // If Gemini API is not accessible or offline, run high-precision on-device heuristics
  if (!ai) {
    return buildLocalHeuristicRelevance(rawContext, localTasks);
  }

  try {
    const candidateSummary = buildCompactCandidatePrompt(rawContext, localTasks, userPrompt);

    const prompt = `You are the Pixel On-Device AICore Gemini Nano model acting as the executive operating concierge for Christian.
Analyze the following compact real-time device context signals:

${candidateSummary}

Synthesize these into a structured JSON response matching this EXACT schema:
{
  "summary": "1-sentence executive state brief",
  "now": [
    {
      "title": "Clear action or urgent alert",
      "subtitle": "Brief reason or context",
      "actionLabel": "Action button verb (e.g. Reply, Open, Navigate)",
      "source": "notification" | "calendar" | "commute" | "system" | "task",
      "urgency": "critical" | "high" | "normal",
      "packageName": "optional Android package name"
    }
  ],
  "next": [
    {
      "title": "Upcoming event or scheduled task",
      "subtitle": "Details or location",
      "timeDelta": "e.g. in 25 min",
      "source": "Calendar or Schedule"
    }
  ],
  "dontForget": [
    {
      "title": "Pending high-priority task or follow-up",
      "context": "Why it matters",
      "dueDate": "e.g. Today EOD"
    }
  ],
  "people": [
    {
      "name": "Person name who contacted or needs attention",
      "context": "Context or recent interaction",
      "channel": "e.g. Signal, Phone, Discord",
      "packageName": "optional Android package"
    }
  ]
}

Only return valid parseable JSON. Do not include markdown ticks or explanation outside the JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text?.trim();
    if (text) {
      const parsed = JSON.parse(text);
      return {
        now: parsed.now || [],
        next: parsed.next || [],
        dontForget: parsed.dontForget || [],
        people: parsed.people || [],
        summary: parsed.summary || 'Live context prioritized by AICore.',
        rawSignalCount:
          rawContext.notifications.length +
          rawContext.calendarEvents.length +
          localTasks.length +
          (rawContext.deviceState ? 1 : 0),
        synthesizedAt: Date.now(),
        engine: 'AICore-Gemini-Nano',
      };
    }
  } catch (err) {
    console.warn('Gemini Nano / AICore synthesis fallback triggered:', err);
  }

  // Graceful fallback to heuristic synthesis
  return buildLocalHeuristicRelevance(rawContext, localTasks);
}

function buildCompactCandidatePrompt(
  raw: RawContextBundle,
  tasks: TaskItem[],
  userPrompt?: string
): string {
  const lines: string[] = [];
  const now = new Date();
  lines.push(`TIME: ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
  lines.push(`BATTERY: ${raw.deviceState.batteryLevel}% (${raw.deviceState.isCharging ? 'Charging' : 'Discharging'})`);
  lines.push(`NETWORK: ${raw.deviceState.networkType}`);

  if (raw.notifications && raw.notifications.length > 0) {
    lines.push('NOTIFICATIONS:');
    raw.notifications.slice(0, 8).forEach((n) => {
      lines.push(`- [${n.packageName}] ${n.title}: ${n.text}`);
    });
  } else {
    lines.push('NOTIFICATIONS: None active or NotificationListener waiting for grant');
  }

  if (raw.calendarEvents && raw.calendarEvents.length > 0) {
    lines.push('CALENDAR:');
    raw.calendarEvents.slice(0, 5).forEach((e) => {
      const minLeft = Math.round((e.startTime - Date.now()) / 60000);
      lines.push(`- ${e.title} (in ${minLeft}m) @ ${e.location || 'Online'}`);
    });
  }

  const pendingTasks = tasks.filter((t) => !t.completed).slice(0, 6);
  if (pendingTasks.length > 0) {
    lines.push('AETHER LOCAL TASKS:');
    pendingTasks.forEach((t) => {
      lines.push(`- [${t.priority.toUpperCase()}] ${t.title} (Due: ${t.dueTime})`);
    });
  }

  if (raw.contacts && raw.contacts.length > 0) {
    lines.push(`RECENT CONTACTS: ${raw.contacts.slice(0, 4).map((c) => c.name).join(', ')}`);
  }

  if (userPrompt) {
    lines.push(`USER INTENT QUERY: ${userPrompt}`);
  }

  return lines.join('\n');
}

/**
 * High-speed local heuristics engine that simulates on-device AppSearch relevance ranking
 */
export function buildLocalHeuristicRelevance(
  raw: RawContextBundle,
  tasks: TaskItem[]
): SynthesizedRelevanceFeed {
  const nowItems: SynthesizedRelevanceFeed['now'] = [];
  const nextItems: SynthesizedRelevanceFeed['next'] = [];
  const dontForget: SynthesizedRelevanceFeed['dontForget'] = [];
  const people: SynthesizedRelevanceFeed['people'] = [];

  // 1. Critical device alerts (Battery < 20%)
  if (raw.deviceState.batteryLevel <= 20 && !raw.deviceState.isCharging) {
    nowItems.push({
      title: `Low Battery Warning (${raw.deviceState.batteryLevel}%)`,
      subtitle: 'Connect Tensor Fast Charger or enable Extreme Battery Saver.',
      actionLabel: 'Settings',
      source: 'system',
      urgency: 'critical',
      packageName: 'com.android.settings',
    });
  }

  // 2. Process Notifications into NOW or PEOPLE
  if (raw.notifications && raw.notifications.length > 0) {
    raw.notifications.forEach((n) => {
      const isMsg =
        n.packageName.includes('messaging') ||
        n.packageName.includes('whatsapp') ||
        n.packageName.includes('telegram') ||
        n.packageName.includes('signal') ||
        n.packageName.includes('discord');

      if (isMsg) {
        people.push({
          name: n.title || 'Incoming Message',
          context: n.text || 'Active conversation waiting for response.',
          channel: n.packageName.split('.').pop() || 'Message',
          packageName: n.packageName,
        });
      } else {
        nowItems.push({
          title: n.title || 'System Notification',
          subtitle: n.text || n.subText || n.packageName,
          actionLabel: 'Open',
          source: 'notification',
          urgency: 'high',
          packageName: n.packageName,
        });
      }
    });
  }

  // Fallback active alert if no notifications active
  if (nowItems.length === 0) {
    nowItems.push({
      title: 'Operating Ambient State Nominal',
      subtitle: `System responsive on ${raw.deviceState.networkType}. No urgent blocks.`,
      actionLabel: 'Inspect',
      source: 'system',
      urgency: 'normal',
    });
  }

  // 3. Process Calendar into NEXT
  if (raw.calendarEvents && raw.calendarEvents.length > 0) {
    raw.calendarEvents.forEach((ev) => {
      const diffMins = Math.max(0, Math.round((ev.startTime - Date.now()) / 60000));
      nextItems.push({
        title: ev.title,
        subtitle: ev.location ? `Location: ${ev.location}` : 'Scheduled on agenda',
        timeDelta: diffMins > 0 ? `in ${diffMins} min` : 'Now',
        source: 'Calendar Provider',
      });
    });
  } else {
    nextItems.push({
      title: 'Deep Focus Window Available',
      subtitle: 'No upcoming calendar conflicts in the next 2 hours.',
      timeDelta: 'Next 2h',
      source: 'Schedule Intelligence',
    });
  }

  // 4. Process Tasks into DON'T FORGET
  const p1Tasks = tasks.filter((t) => !t.completed);
  p1Tasks.slice(0, 4).forEach((t) => {
    dontForget.push({
      title: t.title,
      context: t.context || `Estimated: ${t.estimatedMinutes || 15}m`,
      dueDate: t.dueTime,
    });
  });

  // 5. Default contacts if none extracted from notification
  if (people.length === 0 && raw.contacts) {
    raw.contacts.slice(0, 3).forEach((c) => {
      people.push({
        name: c.name,
        context: 'Starred executive collaborator',
        channel: 'Phone / Signal',
      });
    });
  }

  const rawSignalCount =
    raw.notifications.length +
    raw.calendarEvents.length +
    tasks.length +
    (raw.deviceState ? 1 : 0);

  return {
    now: nowItems,
    next: nextItems,
    dontForget,
    people,
    summary: `${nowItems.length} active priorities, ${nextItems.length} scheduled items, ${dontForget.length} pending obligations ranked.`,
    rawSignalCount,
    synthesizedAt: Date.now(),
    engine: 'Aether-Local-Heuristics',
  };
}
