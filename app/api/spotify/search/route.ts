import { NextRequest, NextResponse } from 'next/server';
import { getSpotifyApi } from '../../../../lib/spotify';

/**
 * GET /api/spotify/search?q=[query]&accessToken=[token]
 * Searches Spotify tracks. Requires a valid access token.
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    const accessToken = searchParams.get('accessToken');

    if (!query || !accessToken) {
      return NextResponse.json(
        { error: 'Missing required parameters: q and accessToken' },
        { status: 400 }
      );
    }

    const spotifyApi = getSpotifyApi(accessToken);
    const result = await spotifyApi.searchTracks(query, { limit: 10 });

    const tracks = (result.body.tracks?.items || [])
      .filter((track: any) => track !== null)
      .map((track: any) => ({
        spotifyId: track.id,
        title: track.name,
        artist: track.artists.map((a: any) => a.name).join(', '),
        album: track.album?.name || '',
        albumArt: track.album?.images?.[2]?.url || track.album?.images?.[0]?.url || null,
        previewUrl: track.preview_url || null,
        spotifyUrl: track.external_urls?.spotify || null,
      }));

    return NextResponse.json({ tracks });
  } catch (error: any) {
    console.error('Spotify search error:', error);
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    );
  }
}
