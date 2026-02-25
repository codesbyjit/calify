'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { LogOut, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AuthButton() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="h-10 w-32 animate-pulse rounded-full bg-zinc-800" />
    );
  }

  if (session?.user) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center gap-3"
      >
        <div className="flex items-center gap-2">
          {session.user.image ? (
            <Image
              src={session.user.image}
              alt={session.user.name || 'User'}
              width={36}
              height={36}
              className="rounded-full border-2 border-zinc-700"
            />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-sm font-medium">
              {session.user.email?.[0].toUpperCase()}
            </div>
          )}
          <span className="hidden text-sm text-zinc-300 sm:block">
            {session.user.name || session.user.email}
          </span>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => signOut()}
          className="flex items-center gap-2 rounded-full bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-700 hover:text-white"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Sign Out</span>
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => signIn('google')}
      className={cn(
        'flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-indigo-500/25 transition-all hover:shadow-indigo-500/40'
      )}
    >
      <Calendar className="h-4 w-4" />
      Sign in with Google
    </motion.button>
  );
}
