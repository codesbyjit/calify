'use client';

import { AuthButton } from './AuthButton';
import { Calendar } from 'lucide-react';
import Link from 'next/link';

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800 bg-[#0f0f0f]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500">
            <Calendar className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-semibold text-white">Calify</span>
        </Link>
        <AuthButton />
      </div>
    </header>
  );
}
