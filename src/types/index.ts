export interface CalendarEvent {
  id: string;
  title: string;
  description: string | null;
  start: string;
  end: string;
  location: string | null;
  colorId: string | null;
  htmlLink: string;
  attendees: Attendee[] | null;
  organizer: Organizer | null;
  isAllDay: boolean;
}

export interface Attendee {
  email: string;
  displayName?: string | null;
  responseStatus?: string | null;
}

export interface Organizer {
  email: string;
  displayName?: string;
  self?: boolean;
}

export interface EventsResponse {
  success: boolean;
  data: {
    events: CalendarEvent[];
    summary: string;
  };
}

export interface User {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
}

export type DateFilter = 'today' | 'week' | 'month';

export interface Stats {
  total: number;
  today: number;
  upcoming: number;
}
