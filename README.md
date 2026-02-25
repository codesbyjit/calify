# Calify - Google Calendar Dashboard

A production-ready full-stack web application that integrates with Google Calendar via the Google Calendar API. Features secure OAuth 2.0 authentication, real-time event fetching, and a modern animated dashboard UI.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8)

## Features

- **Secure Authentication** - Google OAuth 2.0 with refresh tokens
- **Real-time Sync** - Auto-refreshes calendar events every 5 minutes
- **Modern UI** - Animated dashboard with Framer Motion
- **Responsive Design** - Works on mobile, tablet, and desktop
- **Production Ready** - Security headers, TypeScript, ESLint

## Prerequisites

- Node.js 20+
- Google Cloud Platform account

## Quick Start

### 1. Clone and Install

```bash
cd calify
npm install
```

### 2. Set Up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google Calendar API and People API
4. Go to Credentials > Create OAuth client ID
5. Set application type to Web application
6. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
7. Copy your Client ID and Client Secret

### 3. Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

Generate a secret key:
```bash
openssl rand -base64 32
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
calify/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/route.ts  # NextAuth handlers
│   │   │   └── events/route.ts              # Calendar events API
│   │   ├── dashboard/page.tsx                # Protected dashboard
│   │   ├── layout.tsx                        # Root layout with providers
│   │   ├── page.tsx                         # Landing page
│   │   └── globals.css                      # Global styles
│   ├── components/
│   │   ├── AuthButton.tsx                   # Sign in/out button
│   │   ├── CalendarEventCard.tsx            # Event display card
│   │   ├── Dashboard.tsx                   # Main dashboard
│   │   ├── EventList.tsx                    # Grouped event list
│   │   ├── Header.tsx                       # Navigation header
│   │   ├── LoadingSpinner.tsx               # Loading states
│   │   ├── Providers.tsx                    # Session provider
│   │   └── StatsCard.tsx                    # Statistics cards
│   ├── lib/
│   │   ├── auth.ts                          # NextAuth configuration
│   │   ├── google.ts                        # Google Calendar API
│   │   └── utils.ts                         # Utility functions
│   └── types/
│       └── index.ts                         # TypeScript definitions
├── .env.example                             # Environment template
├── next.config.ts                           # Next.js config
├── tailwind.config.ts                       # Tailwind config
└── package.json
```

## API Endpoints

### Authentication
- `GET /api/auth/signin` - Sign in page
- `GET /api/auth/signout` - Sign out
- `GET /api/auth/callback/google` - OAuth callback

### Events
- `GET /api/events` - Fetch calendar events
  - Query params:
    - `timeMin` - Start date (ISO 8601)
    - `timeMax` - End date (ISO 8601)
    - `maxResults` - Max events (default: 50)

## Technology Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Auth:** NextAuth.js 5 (Beta)
- **Styling:** Tailwind CSS 4
- **Animations:** Framer Motion
- **Calendar API:** Google APIs Node.js Client

## Security

- HTTP-only session cookies
- CSRF protection
- Security headers (X-Frame-Options, X-Content-Type-Options, etc.)
- Environment variable protection
- Input validation on API routes

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Variables for Production

```env
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-production-secret
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
```

## License

MIT
