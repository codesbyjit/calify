'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import type { CalendarEvent, DateFilter } from '@/types';
import { CALENDAR_COLORS } from '@/lib/utils';

interface CalendarGridProps {
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onDateClick: (date: Date) => void;
  filter?: DateFilter;
}

export function CalendarGrid({ events, onEventClick, onDateClick, filter = 'month' }: CalendarGridProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const computedDate = useMemo(() => {
    if (filter === 'today') {
      return new Date();
    } else if (filter === 'week') {
      const now = new Date();
      const dayOfWeek = now.getDay();
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - dayOfWeek);
      return startOfWeek;
    }
    return currentDate;
  }, [filter, currentDate]);

  const { year, month, monthName, weekDays, weekDaysData, isWeekView } = useMemo(() => {
    const y = computedDate.getFullYear();
    const m = computedDate.getMonth();
    const today = new Date();
    
    const isWeek = filter === 'week' || filter === 'today';
    
    let days: (number | null)[] = [];
    const daysData: { date: Date; isCurrentMonth: boolean }[] = [];
    
    if (isWeek) {
      const startOfWeek = new Date(today);
      const dayOfWeek = startOfWeek.getDay();
      startOfWeek.setDate(today.getDate() - dayOfWeek);
      
      for (let i = 0; i < 7; i++) {
        const d = new Date(startOfWeek);
        d.setDate(startOfWeek.getDate() + i);
        daysData.push({
          date: d,
          isCurrentMonth: d.getMonth() === today.getMonth()
        });
      }
      days = daysData.map(() => 1);
    } else {
      const firstDay = new Date(y, m, 1).getDay();
      const totalDays = new Date(y, m + 1, 0).getDate();
      
      for (let i = 0; i < firstDay; i++) {
        days.push(null);
        const prevDate = new Date(y, m, -firstDay + i + 1);
        daysData.push({ date: prevDate, isCurrentMonth: false });
      }
      for (let i = 1; i <= totalDays; i++) {
        days.push(i);
        daysData.push({ date: new Date(y, m, i), isCurrentMonth: true });
      }
    }

    return {
      year: y,
      month: m,
      monthName: computedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      weekDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      weekDaysData: daysData,
      isWeekView: isWeek,
    };
  }, [computedDate, filter]);

  const eventsByDay = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};
    events.forEach((event) => {
      const dateKey = new Date(event.start).toDateString();
      if (!map[dateKey]) map[dateKey] = [];
      map[dateKey].push(event);
    });
    return map;
  }, [events]);

  const prevNavigation = () => {
    if (isWeekView) {
      const newDate = new Date(currentDate);
      newDate.setDate(newDate.getDate() - 7);
      setCurrentDate(newDate);
    } else {
      setCurrentDate(new Date(year, month - 1, 1));
    }
  };

  const nextNavigation = () => {
    if (isWeekView) {
      const newDate = new Date(currentDate);
      newDate.setDate(newDate.getDate() + 7);
      setCurrentDate(newDate);
    } else {
      setCurrentDate(new Date(year, month + 1, 1));
    }
  };

  const goToToday = () => setCurrentDate(new Date());

  const today = new Date();
  const todayStr = today.toDateString();

  if (filter === 'today') {
    const todayEvents = eventsByDay[todayStr] || [];
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
        <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
          <h2 className="text-lg font-semibold text-white">{today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</h2>
        </div>
        <div className="p-4">
          {todayEvents.length === 0 ? (
            <p className="text-center text-zinc-500 py-8">No events for today</p>
          ) : (
            <div className="space-y-3">
              {todayEvents.map((event, index) => (
                <motion.button
                  key={event.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => onEventClick(event)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 transition-colors text-left"
                >
                  <div className="w-1 h-12 rounded-full" style={{ backgroundColor: event.colorId ? CALENDAR_COLORS[event.colorId] || '#6366f1' : '#6366f1' }} />
                  <div className="flex-1">
                    <p className="font-medium text-white">{event.title}</p>
                    <p className="text-sm text-zinc-400">
                      {event.isAllDay ? 'All day' : new Date(event.start).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                      {event.location && ` • ${event.location}`}
                    </p>
                  </div>
                  <Plus className="h-5 w-5 text-zinc-500" />
                </motion.button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
      <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-white">{isWeekView ? `Week of ${weekDaysData[0]?.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` : monthName}</h2>
          <button
            onClick={goToToday}
            className="rounded-md bg-zinc-800 px-2 py-1 text-xs font-medium text-zinc-300 hover:bg-zinc-700 hover:text-white"
          >
            Today
          </button>
        </div>
        <div className="flex items-center gap-1">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={prevNavigation}
            className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white"
          >
            <ChevronLeft className="h-5 w-5" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={nextNavigation}
            className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white"
          >
            <ChevronRight className="h-5 w-5" />
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-7 border-b border-zinc-800">
        {weekDays.map((day) => (
          <div key={day} className="px-2 py-2 text-center text-xs font-medium text-zinc-500">
            {isWeekView ? day : day}
          </div>
        ))}
      </div>

      <div className={`grid ${isWeekView ? 'grid-cols-7' : 'grid-cols-7'}`}>
        {weekDaysData.map((dayData, index) => {
          const dateStr = dayData.date.toDateString();
          const isToday = dateStr === todayStr;
          const dayEvents = eventsByDay[dateStr] || [];

          return (
            <motion.div
              key={dateStr}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.01 }}
              onClick={() => onDateClick(dayData.date)}
              className={`min-h-[100px] cursor-pointer border border-zinc-800/50 p-1 transition-colors hover:bg-zinc-800/30 ${
                isToday ? 'bg-indigo-500/10' : !dayData.isCurrentMonth && !isWeekView ? 'bg-zinc-950/30' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`flex h-7 w-7 items-center justify-center rounded-full text-sm ${
                  isToday ? 'bg-indigo-500 text-white' : 'text-zinc-400'
                }`}>
                  {dayData.date.getDate()}
                </span>
                {isToday && (
                  <button
                    onClick={(e) => { e.stopPropagation(); onDateClick(dayData.date); }}
                    className="rounded-full p-1 text-indigo-400 hover:bg-indigo-500/20"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                )}
              </div>
              <div className="mt-1 space-y-1">
                <AnimatePresence>
                  {dayEvents.slice(0, isWeekView ? 5 : 3).map((event, i) => (
                    <motion.button
                      key={event.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={(e) => { e.stopPropagation(); onEventClick(event); }}
                      className="w-full truncate rounded px-1.5 py-0.5 text-left text-xs font-medium text-white hover:opacity-80"
                      style={{
                        backgroundColor: event.colorId ? CALENDAR_COLORS[event.colorId] || '#6366f1' : '#6366f1',
                      }}
                    >
                      {event.isAllDay ? event.title : `${new Date(event.start).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })} ${event.title}`}
                    </motion.button>
                  ))}
                </AnimatePresence>
                {dayEvents.length > (isWeekView ? 5 : 3) && (
                  <span className="text-xs text-zinc-500">+{dayEvents.length - (isWeekView ? 5 : 3)} more</span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
