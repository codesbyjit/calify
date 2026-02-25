'use client';

import { motion } from 'framer-motion';
import type { CalendarEvent } from '@/types';
import { CalendarEventCard } from './CalendarEventCard';
import { getRelativeDate } from '@/lib/utils';

interface EventListProps {
  events: CalendarEvent[];
}

export function EventList({ events }: EventListProps) {
  const groupedEvents = events.reduce<Record<string, CalendarEvent[]>>((acc, event) => {
    const dateKey = new Date(event.start).toDateString();
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(event);
    return acc;
  }, {});

  const sortedDates = Object.keys(groupedEvents).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  if (events.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-16 text-center"
      >
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-800">
          <svg
            className="h-8 w-8 text-zinc-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-white">No events found</h3>
        <p className="mt-1 text-sm text-zinc-500">
          No events scheduled for this time period
        </p>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {sortedDates.map((dateKey) => (
        <div key={dateKey}>
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="sticky top-0 z-10 -mx-4 bg-[#0f0f0f]/80 px-4 py-2 text-sm font-medium text-zinc-400 backdrop-blur-xl"
          >
            {getRelativeDate(groupedEvents[dateKey][0].start)}
          </motion.h2>
          <div className="mt-3 flex flex-col gap-3">
            {groupedEvents[dateKey].map((event, index) => (
              <CalendarEventCard key={event.id} event={event} index={index} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
