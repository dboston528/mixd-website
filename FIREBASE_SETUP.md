# Firebase Setup Instructions

This guide will help you set up Firebase for the Music Planning Dashboard feature.

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard:
   - Enter project name
   - Enable Google Analytics (optional)
   - Create project

## Step 2: Enable Authentication

1. In Firebase Console, go to **Authentication** > **Sign-in method**
2. Enable **Email/Password** authentication
3. (Optional) Enable **Google** sign-in if you want social login

## Step 3: Create Firestore Database

1. In Firebase Console, go to **Firestore Database**
2. Click "Create database"
3. Choose **Start in test mode** (for development)
   - **Note**: In production, set up proper security rules
4. Select a location for your database
5. Click "Enable"

## Step 4: Get Firebase Configuration

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll down to "Your apps" section
3. Click the web icon (`</>`) to add a web app
4. Register your app (give it a nickname)
5. Copy the Firebase configuration object

## Step 5: Set Environment Variables

1. Create a `.env.local` file in the root of your project (if it doesn't exist)
2. Add the following variables with your Firebase config values:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## Step 6: Set Up Firebase Admin SDK (Optional, for server-side operations)

If you need server-side operations (API routes), you'll need the Admin SDK:

1. In Firebase Console, go to **Project Settings** > **Service Accounts**
2. Click "Generate new private key"
3. Download the JSON file
4. Add these to your `.env.local`:

```env
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
```

**Important**: The private key should be on a single line with `\n` characters for newlines.

## Step 7: Set Up Firestore Security Rules

For development, you can use test mode. For production, set up proper security rules:

1. Go to **Firestore Database** > **Rules**
2. Update the rules to secure your data:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own events
    match /events/{eventId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    // Playlists are tied to events
    match /playlists/{playlistId} {
      allow read, write: if request.auth != null;
    }
    
    // Song requests can be read by event owners, written by anyone
    match /songRequests/{requestId} {
      allow read: if request.auth != null;
      allow create: if true; // Public creation for guest requests
      allow update: if request.auth != null; // Only authenticated users can update
    }
    
    // Timeline items
    match /timelineItems/{itemId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Step 8: Test the Setup

1. Run `npm install` to install Firebase dependencies (if not already done)
2. Start your development server: `npm run dev`
3. Navigate to `/signup` and create a test account
4. Try logging in at `/login`
5. Access the dashboard at `/dashboard`

## Troubleshooting

### "Firebase: Error (auth/configuration-not-found)"
- Make sure all environment variables are set in `.env.local`
- Restart your development server after adding environment variables

### "Missing or insufficient permissions"
- Check your Firestore security rules
- Make sure you're authenticated when accessing protected routes

### "Cannot read properties of undefined"
- Check that Firebase is initialized correctly
- Verify the `lib/firebase.ts` file has correct configuration

## Next Steps

Once Firebase is set up:
1. Create your first event in the dashboard
2. Add songs to playlists
3. Set up must-play and do-not-play lists
4. Share the song request link with guests: `/request-song/[eventId]`
5. Manage song requests and timeline in the dashboard

## Support

For Firebase-specific issues, check the [Firebase Documentation](https://firebase.google.com/docs).

