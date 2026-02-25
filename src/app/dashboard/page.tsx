'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Plus, List, Calendar as CalendarIcon } from 'lucide-react';
import { Header } from '@/components/Header';
import { StatsCard } from '@/components/StatsCard';
import { EventList } from '@/components/EventList';
import { CalendarGrid } from '@/components/CalendarGrid';
import { EventModal, type EventFormData } from '@/components/EventModal';
import { LoadingSpinner, LoadingPage } from '@/components/LoadingSpinner';
import type { CalendarEvent, DateFilter } from '@/types';
import { getTimeRange } from '@/lib/utils';

interface EventsResponse {
  success: boolean;
  data: {
    events: CalendarEvent[];
    summary: string;
  };
}

interface CreateEventResponse {
  success: boolean;
  data?: CalendarEvent;
  error?: string;
}

type ViewMode = 'calendar' | 'list';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [filter, setFilter] = useState<DateFilter>('month');
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('calendar');
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  useEffect(() => {
    async function fetchEvents() {
      if (!session?.accessToken) return;

      setLoading(true);
      try {
        const { timeMin, timeMax } = getTimeRange(filter);
        const params = new URLSearchParams({
          timeMin,
          timeMax,
          maxResults: '100',
        });

        const response = await fetch(`/api/events?${params}`);
        const data: EventsResponse = await response.json();

        if (data.success) {
          setEvents(data.data.events);
        }
      } catch (error) {
        console.error('Failed to fetch events:', error);
      } finally {
        setLoading(false);
      }
    }

    if (session?.accessToken) {
      fetchEvents();
      const interval = setInterval(fetchEvents, 5 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [session, filter]);

  const handleCreateEvent = async (formData: EventFormData) => {
    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data: CreateEventResponse = await response.json();

      if (data.success && data.data) {
        setEvents((prev) => [...prev, data.data!]);
        setShowEventModal(false);
        setSelectedDate(undefined);
      } else {
        alert(data.error || 'Failed to create event');
      }
    } catch (error) {
      console.error('Failed to create event:', error);
      alert('Failed to create event');
    }
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setShowEventModal(true);
  };

  const handleEventClick = (event: CalendarEvent) => {
    if (event.htmlLink) {
      window.open(event.htmlLink, '_blank');
    }
  };

  if (status === 'loading' || !session) {
    return <LoadingPage />;
  }

  const now = new Date();
  const todayEvents = events.filter((event) => {
    const eventDate = new Date(event.start);
    return eventDate.toDateString() === now.toDateString();
  });

  const upcomingEvents = events.filter((event) => {
    return new Date(event.start) > now;
  });

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <Header />
      <main className="mx-auto max-w-7xl px-4 pt-24 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Dashboard</h1>
              <p className="mt-1 text-zinc-400">
                Welcome back, {session.user?.name || session.user?.email}
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setSelectedDate(undefined);
                setShowEventModal(true);
              }}
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 px-4 py-2 text-sm font-medium text-white"
            >
              <Plus className="h-4 w-4" />
              New Event
            </motion.button>
          </div>
        </motion.div>

        <div className="mb-6 flex flex-wrap items-center gap-3">
          <div className="flex rounded-lg bg-zinc-800 p-1">
            {(['today', 'week', 'month'] as DateFilter[]).map((f) => (
              <motion.button
                key={f}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setFilter(f)}
                className={`rounded-md px-4 py-1.5 text-sm font-medium capitalize transition-colors ${
                  filter === f
                    ? 'bg-indigo-500 text-white'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {f}
              </motion.button>
            ))}
          </div>

          <div className="ml-auto flex rounded-lg bg-zinc-800 p-1">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setViewMode('calendar')}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                viewMode === 'calendar'
                  ? 'bg-indigo-500 text-white'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <CalendarIcon className="h-4 w-4" />
              Calendar
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                viewMode === 'list'
                  ? 'bg-indigo-500 text-white'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <List className="h-4 w-4" />
              List
            </motion.button>
          </div>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatsCard
            title="Total Events"
            value={events.length}
            icon="calendar"
            delay={0}
          />
          <StatsCard
            title="Today's Events"
            value={todayEvents.length}
            icon="clock"
            delay={0.1}
          />
          <StatsCard
            title="Upcoming"
            value={upcomingEvents.length}
            icon="trending"
            delay={0.2}
          />
        </div>

        {loading ? (
          <div className="py-16">
            <LoadingSpinner />
          </div>
        ) : viewMode === 'calendar' ? (
          <CalendarGrid
            events={events}
            onEventClick={handleEventClick}
            onDateClick={handleDateClick}
            filter={filter}
          />
        ) : (
          <div>
            <h2 className="mb-4 text-xl font-semibold text-white">Events</h2>
            <EventList events={events} />
          </div>
        )}
      </main>

      <EventModal
        isOpen={showEventModal}
        onClose={() => {
          setShowEventModal(false);
          setSelectedDate(undefined);
        }}
        onSubmit={handleCreateEvent}
        initialDate={selectedDate}
      />
    </div>
  );
}
