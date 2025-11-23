# Spotify Integration Setup

This guide will help you set up Spotify playlist import functionality.

## Step 1: Create Spotify App

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Log in with your Spotify account
3. Click "Create an app"
4. Fill in the app details:
   - App name: MIXD Music Planning (or your choice)
   - App description: Music planning dashboard for DJ services
   - Redirect URI: `http://localhost:3000/api/spotify/callback` (for development)
   - For production, add: `https://yourdomain.com/api/spotify/callback`
5. Click "Save"
6. Accept the terms and conditions

## Step 2: Get Your Credentials

1. In your Spotify app dashboard, you'll see:
   - **Client ID** - Copy this
   - **Client Secret** - Click "Show client secret" and copy it
2. Note your **Redirect URI** (should match what you entered)

## Step 3: Add Environment Variables

Add these to your `.env.local` file:

```env
SPOTIFY_CLIENT_ID=your_client_id_here
SPOTIFY_CLIENT_SECRET=your_client_secret_here
SPOTIFY_REDIRECT_URI=http://localhost:3000/api/spotify/callback
```

**For production**, update `SPOTIFY_REDIRECT_URI` to your production domain:
```env
SPOTIFY_REDIRECT_URI=https://yourdomain.com/api/spotify/callback
```

## Step 4: Update Redirect URI in Spotify Dashboard

Make sure the redirect URI in your Spotify app settings matches exactly:
- Development: `http://localhost:3000/api/spotify/callback`
- Production: `https://yourdomain.com/api/spotify/callback`

## Step 5: Test the Integration

1. Start your development server: `npm run dev`
2. Navigate to an event's playlist page
3. Click "Import from Spotify"
4. Click "Connect Spotify"
5. Authorize the app in Spotify
6. You should be redirected back and see your playlists

## Features

- **Connect Spotify Account**: One-time connection, tokens stored securely
- **Import My Playlists**: Import from your own Spotify playlists
- **Import Public Playlists**: Import any public Spotify playlist via URL or ID
- **Create New or Add to Existing**: Choose to create a new playlist or add to existing one

## Troubleshooting

### "Invalid redirect URI"
- Make sure the redirect URI in Spotify dashboard matches exactly (including http/https, port, path)
- No trailing slashes

### "Invalid client"
- Check that `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET` are correct
- Make sure there are no extra spaces in `.env.local`

### "Failed to fetch playlists"
- Check that tokens are stored correctly
- Try disconnecting and reconnecting Spotify
- Check browser console for errors

### Token Refresh
- Tokens are automatically refreshed when needed
- If you get authentication errors, try disconnecting and reconnecting

## Security Notes

- Never commit `.env.local` to git
- Keep your Client Secret secure
- Use different Spotify apps for development and production
- Tokens are stored securely in Firestore

