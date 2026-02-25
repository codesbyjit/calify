import { google } from 'googleapis';
import type { CalendarEvent } from '@/types';

export async function getCalendarClient(accessToken: string, refreshToken?: string) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.NEXTAUTH_URL
  );

  oauth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  return google.calendar({ version: 'v3', auth: oauth2Client });
}

export async function getCalendarEvents(
  accessToken: string,
  refreshToken?: string,
  timeMin?: string,
  timeMax?: string,
  maxResults: number = 50
): Promise<{ events: CalendarEvent[]; summary: string }> {
  const calendar = await getCalendarClient(accessToken, refreshToken);

  const now = new Date().toISOString();
  const startTime = timeMin || now;
  const endTime = timeMax || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

  const response = await calendar.events.list({
    calendarId: 'primary',
    timeMin: startTime,
    timeMax: endTime,
    maxResults,
    singleEvents: true,
    orderBy: 'startTime',
  });

  const events: CalendarEvent[] = (response.data.items || []).map((event) => {
    const start = event.start?.dateTime || event.start?.date || '';
    const end = event.end?.dateTime || event.end?.date || '';
    const isAllDay = !!event.start?.date && !event.start?.dateTime;

    const attendees = event.attendees?.map(a => ({
      email: a.email || '',
      displayName: a.displayName,
      responseStatus: a.responseStatus,
    })) || null;

    const organizer = event.organizer ? {
      email: event.organizer.email || '',
      displayName: event.organizer.displayName,
      self: event.organizer.self,
    } : null;

    return {
      id: event.id || '',
      title: event.summary || 'Untitled Event',
      description: event.description || null,
      start,
      end,
      location: event.location || null,
      colorId: event.colorId || null,
      htmlLink: event.htmlLink || '',
      attendees,
      organizer,
      isAllDay,
    };
  });

  const calendarData = await calendar.calendarList.get({ calendarId: 'primary' });
  const summary = calendarData.data.summary || 'My Calendar';

  return { events, summary };
}

export interface CreateEventInput {
  title: string;
  description?: string;
  startDate: string;
  startTime?: string;
  endDate: string;
  endTime?: string;
  location?: string;
  isAllDay: boolean;
}

export async function createCalendarEvent(
  accessToken: string,
  refreshToken: string | undefined,
  input: CreateEventInput
): Promise<CalendarEvent> {
  const calendar = await getCalendarClient(accessToken, refreshToken);

  let start: { date?: string; dateTime?: string };
  let end: { date?: string; dateTime?: string };

  if (input.isAllDay) {
    start = { date: input.startDate };
    end = { date: input.endDate };
  } else {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
    const startDateTime = `${input.startDate}T${input.startTime || '09:00'}:00`;
    const endDateTime = `${input.endDate}T${input.endTime || '10:00'}:00`;
    start = { dateTime: startDateTime, timeZone } as { date?: string; dateTime?: string };
    end = { dateTime: endDateTime, timeZone } as { date?: string; dateTime?: string };
  }

  const response = await calendar.events.insert({
    calendarId: 'primary',
    requestBody: {
      summary: input.title,
      description: input.description,
      location: input.location,
      start,
      end,
    },
  });

  const event = response.data;

  return {
    id: event.id || '',
    title: event.summary || 'Untitled Event',
    description: event.description || null,
    start: event.start?.dateTime || event.start?.date || '',
    end: event.end?.dateTime || event.end?.date || '',
    location: event.location || null,
    colorId: event.colorId || null,
    htmlLink: event.htmlLink || '',
    attendees: event.attendees?.map(a => ({
      email: a.email || '',
      displayName: a.displayName,
      responseStatus: a.responseStatus,
    })) || null,
    organizer: event.organizer ? {
      email: event.organizer.email || '',
      displayName: event.organizer.displayName,
      self: event.organizer.self,
    } : null,
    isAllDay: input.isAllDay,
  };
}
