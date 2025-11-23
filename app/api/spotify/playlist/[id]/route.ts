import { NextRequest, NextResponse } from 'next/server';
import { getSpotifyApi } from '../../../../../lib/spotify';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const searchParams = request.nextUrl.searchParams;
  const accessToken = searchParams.get('accessToken');
  const playlistId = params.id;

  if (!accessToken) {
    return NextResponse.json(
      { error: 'Access token required' },
      { status: 401 }
    );
  }

  try {
    const spotifyApi = getSpotifyApi(accessToken);
    
    // Get playlist details
    const playlistData = await spotifyApi.getPlaylist(playlistId);
    const playlist = playlistData.body;
    
    // Get all tracks (handle pagination)
    let allTracks: any[] = [];
    let offset = 0;
    const limit = 100;
    
    while (true) {
      const tracksData = await spotifyApi.getPlaylistTracks(playlistId, {
        offset,
        limit,
      });
      
      allTracks = allTracks.concat(tracksData.body.items);
      
      if (tracksData.body.items.length < limit) {
        break;
      }
      offset += limit;
    }
    
    const songs = allTracks
      .filter((item: any) => item.track && !item.track.is_local)
      .map((item: any) => ({
        id: item.track.id,
        title: item.track.name,
        artist: item.track.artists.map((a: any) => a.name).join(', '),
        spotifyId: item.track.id,
        album: item.track.album.name,
        duration: item.track.duration_ms,
      }));
    
    return NextResponse.json({
      playlist: {
        id: playlist.id,
        name: playlist.name,
        description: playlist.description,
        image: playlist.images[0]?.url,
      },
      songs,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch playlist', message: error.message },
      { status: 500 }
    );
  }
}

