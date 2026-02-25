import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getCalendarEvents, createCalendarEvent, type CreateEventInput } from '@/lib/google';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.accessToken) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const timeMin = searchParams.get('timeMin') || undefined;
    const timeMax = searchParams.get('timeMax') || undefined;
    const maxResults = parseInt(searchParams.get('maxResults') || '50', 10);

    const { events, summary } = await getCalendarEvents(
      session.accessToken,
      session.refreshToken,
      timeMin,
      timeMax,
      maxResults
    );

    return NextResponse.json({
      success: true,
      data: { events, summary },
    });
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch events',
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.accessToken) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body: CreateEventInput = await request.json();

    if (!body.title || !body.startDate) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const event = await createCalendarEvent(
      session.accessToken,
      session.refreshToken,
      body
    );

    return NextResponse.json({
      success: true,
      data: event,
    });
  } catch (error) {
    console.error('Error creating calendar event:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create event' },
      { status: 500 }
    );
  }
}
