import { NextRequest, NextResponse } from 'next/server';
import { getSpotifyAuthUrl } from '../../../../lib/spotify';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const authUrl = getSpotifyAuthUrl(userId || undefined);
    return NextResponse.json({ authUrl });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to generate auth URL', message: error.message },
      { status: 500 }
    );
  }
}

