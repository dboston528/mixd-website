import SpotifyWebApi from 'spotify-web-api-node';

export function getSpotifyApi(accessToken: string) {
  const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  });
  
  spotifyApi.setAccessToken(accessToken);
  return spotifyApi;
}

export function getSpotifyAuthUrl(state?: string): string {
  const scopes = [
    'user-read-private',
    'user-read-email',
    'playlist-read-private',
    'playlist-read-collaborative',
  ];
  
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.SPOTIFY_CLIENT_ID || '',
    scope: scopes.join(' '),
    redirect_uri: process.env.SPOTIFY_REDIRECT_URI || '',
    ...(state && { state }),
  });
  
  return `https://accounts.spotify.com/authorize?${params.toString()}`;
}

export async function exchangeCodeForTokens(code: string) {
  const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: process.env.SPOTIFY_REDIRECT_URI,
  });
  
  const data = await spotifyApi.authorizationCodeGrant(code);
  return {
    accessToken: data.body.access_token,
    refreshToken: data.body.refresh_token,
    expiresIn: data.body.expires_in,
  };
}

export async function refreshAccessToken(refreshToken: string) {
  const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    refreshToken: refreshToken,
  });
  
  const data = await spotifyApi.refreshAccessToken();
  return {
    accessToken: data.body.access_token,
    expiresIn: data.body.expires_in,
  };
}

