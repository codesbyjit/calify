'use client';

import { motion } from 'framer-motion';
import { Calendar, Clock, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';

interface StatsCardProps {
  title: string;
  value: number;
  icon: 'calendar' | 'clock' | 'trending';
  delay?: number;
}

function AnimatedNumber({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const duration = 1000;
    const steps = 30;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return <span>{displayValue}</span>;
}

const iconMap = {
  calendar: Calendar,
  clock: Clock,
  trending: TrendingUp,
};

const colorMap: Record<string, string> = {
  calendar: 'from-indigo-500/20 to-indigo-600/10 border-indigo-500/30',
  clock: 'from-violet-500/20 to-violet-600/10 border-violet-500/30',
  trending: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30',
};

export function StatsCard({ title, value, icon, delay = 0 }: StatsCardProps) {
  const Icon = iconMap[icon];
  const colorClass = colorMap[icon];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className={`relative overflow-hidden rounded-xl border bg-gradient-to-br ${colorClass} p-5`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-zinc-400">{title}</p>
          <p className="mt-1 text-3xl font-bold text-white">
            <AnimatedNumber value={value} />
          </p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-800/50">
          <Icon className="h-6 w-6 text-zinc-300" />
        </div>
      </div>
    </motion.div>
  );
}
