'use client';

import { motion } from 'framer-motion';
import { MapPin, ExternalLink, Clock, Users } from 'lucide-react';
import type { CalendarEvent } from '@/types';
import { formatTime, CALENDAR_COLORS } from '@/lib/utils';

interface CalendarEventCardProps {
  event: CalendarEvent;
  index: number;
}

export function CalendarEventCard({ event, index }: CalendarEventCardProps) {
  const eventColor = event.colorId
    ? CALENDAR_COLORS[event.colorId] || '#6366f1'
    : '#6366f1';

  return (
    <motion.a
      href={event.htmlLink}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ scale: 1.02, y: -2 }}
      className="group relative flex flex-col gap-3 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 text-left transition-all hover:border-zinc-700 hover:bg-zinc-900 hover:shadow-lg hover:shadow-indigo-500/10"
    >
      <div
        className="absolute left-0 top-3 h-1 w-1 rounded-full"
        style={{ backgroundColor: eventColor }}
      />
      
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-medium text-white line-clamp-2 pr-8">
          {event.title}
        </h3>
        <ExternalLink className="h-4 w-4 flex-shrink-0 text-zinc-600 opacity-0 transition-opacity group-hover:opacity-100" />
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-zinc-400">
        {event.isAllDay ? (
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            All day
          </span>
        ) : (
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            {formatTime(event.start)}
          </span>
        )}
        
        {event.location && (
          <span className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" />
            <span className="line-clamp-1">{event.location}</span>
          </span>
        )}

        {event.attendees && event.attendees.length > 0 && (
          <span className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5" />
            {event.attendees.length}
          </span>
        )}
      </div>

      {event.description && (
        <p className="line-clamp-2 text-sm text-zinc-500">
          {event.description}
        </p>
      )}
    </motion.a>
  );
}
