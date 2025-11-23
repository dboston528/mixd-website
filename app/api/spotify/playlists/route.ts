import { NextRequest, NextResponse } from 'next/server';
import { getSpotifyApi } from '../../../../lib/spotify';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const accessToken = searchParams.get('accessToken');

  if (!accessToken) {
    return NextResponse.json(
      { error: 'Access token required' },
      { status: 401 }
    );
  }

  try {
    const spotifyApi = getSpotifyApi(accessToken);
    const data = await spotifyApi.getUserPlaylists();
    
    return NextResponse.json({
      playlists: data.body.items.map((playlist: any) => ({
        id: playlist.id,
        name: playlist.name,
        description: playlist.description,
        image: playlist.images?.[0]?.url || null,
        tracks: playlist.tracks.total,
        owner: playlist.owner?.display_name || playlist.owner?.id || 'Unknown',
      })),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch playlists', message: error.message },
      { status: 500 }
    );
  }
}
