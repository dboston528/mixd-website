declare module 'spotify-web-api-node' {
  interface SpotifyWebApiConfig {
    clientId?: string;
    clientSecret?: string;
    redirectUri?: string;
    refreshToken?: string;
  }

  class SpotifyWebApi {
    constructor(config?: SpotifyWebApiConfig);
    setAccessToken(token: string): void;
    setRefreshToken(token: string): void;
    authorizationCodeGrant(code: string): Promise<any>;
    refreshAccessToken(): Promise<any>;
    getUserPlaylists(): Promise<any>;
    getPlaylist(id: string): Promise<any>;
    getPlaylistTracks(id: string, options?: Record<string, any>): Promise<any>;
    searchTracks(query: string, options?: Record<string, any>): Promise<any>;
  }

  export default SpotifyWebApi;
}
