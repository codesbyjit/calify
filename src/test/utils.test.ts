import { describe, it, expect } from 'vitest';
import {
  formatDate,
  formatTime,
  formatDateTime,
  getRelativeDate,
  groupEventsByDate,
  getTimeRange,
} from '@/lib/utils';
import type { CalendarEvent } from '@/types';

describe('Utils', () => {
  describe('formatDate', () => {
    it('formats date correctly', () => {
      const result = formatDate('2024-01-15T10:00:00.000Z');
      expect(result).toContain('Jan');
      expect(result).toContain('15');
    });
  });

  describe('formatTime', () => {
    it('formats time correctly', () => {
      const result = formatTime('2024-01-15T14:30:00.000Z');
      expect(result).toMatch(/\d{1,2}:\d{2}\s*(AM|PM)/i);
    });
  });

  describe('formatDateTime', () => {
    it('formats datetime correctly', () => {
      const result = formatDateTime('2024-01-15T14:30:00.000Z');
      expect(result).toContain('Jan');
      expect(result).toContain('15');
    });
  });

  describe('getRelativeDate', () => {
    it('returns Today for current date', () => {
      const today = new Date().toISOString();
      expect(getRelativeDate(today)).toBe('Today');
    });

    it('returns Tomorrow for next day', () => {
      const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      expect(getRelativeDate(tomorrow)).toBe('Tomorrow');
    });

    it('returns Yesterday for previous day', () => {
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      expect(getRelativeDate(yesterday)).toBe('Yesterday');
    });
  });

  describe('groupEventsByDate', () => {
    it('groups events by date', () => {
      const events: CalendarEvent[] = [
        {
          id: '1',
          title: 'Event 1',
          description: null,
          start: '2024-01-15T10:00:00.000Z',
          end: '2024-01-15T11:00:00.000Z',
          location: null,
          colorId: null,
          htmlLink: '',
          attendees: null,
          organizer: null,
          isAllDay: false,
        },
        {
          id: '2',
          title: 'Event 2',
          description: null,
          start: '2024-01-15T14:00:00.000Z',
          end: '2024-01-15T15:00:00.000Z',
          location: null,
          colorId: null,
          htmlLink: '',
          attendees: null,
          organizer: null,
          isAllDay: false,
        },
        {
          id: '3',
          title: 'Event 3',
          description: null,
          start: '2024-01-16T10:00:00.000Z',
          end: '2024-01-16T11:00:00.000Z',
          location: null,
          colorId: null,
          htmlLink: '',
          attendees: null,
          organizer: null,
          isAllDay: false,
        },
      ];

      const result = groupEventsByDate(events);
      expect(Object.keys(result)).toHaveLength(2);
      expect(result[Object.keys(result)[0]]).toHaveLength(2);
    });

    it('sorts events within each group by start time', () => {
      const events: CalendarEvent[] = [
        {
          id: '2',
          title: 'Event 2',
          description: null,
          start: '2024-01-15T14:00:00.000Z',
          end: '2024-01-15T15:00:00.000Z',
          location: null,
          colorId: null,
          htmlLink: '',
          attendees: null,
          organizer: null,
          isAllDay: false,
        },
        {
          id: '1',
          title: 'Event 1',
          description: null,
          start: '2024-01-15T10:00:00.000Z',
          end: '2024-01-15T11:00:00.000Z',
          location: null,
          colorId: null,
          htmlLink: '',
          attendees: null,
          organizer: null,
          isAllDay: false,
        },
      ];

      const result = groupEventsByDate(events);
      const dateKey = Object.keys(result)[0];
      expect(result[dateKey][0].id).toBe('1');
      expect(result[dateKey][1].id).toBe('2');
    });
  });

  describe('getTimeRange', () => {
    it('returns correct range for today', () => {
      const result = getTimeRange('today');
      expect(new Date(result.timeMin).getTime()).toBeLessThanOrEqual(new Date(result.timeMax).getTime());
    });

    it('returns correct range for week', () => {
      const result = getTimeRange('week');
      const diff = new Date(result.timeMax).getTime() - new Date(result.timeMin).getTime();
      expect(diff).toBe(7 * 24 * 60 * 60 * 1000);
    });

    it('returns correct range for month', () => {
      const result = getTimeRange('month');
      expect(new Date(result.timeMin).getTime()).toBeLessThanOrEqual(new Date(result.timeMax).getTime());
    });
  });
});
