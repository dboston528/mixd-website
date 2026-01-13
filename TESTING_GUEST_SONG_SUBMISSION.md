# Testing Guide: Guest Song Submission

This guide provides steps to test the guest no-login song submission feature.

## Implementation Summary

✅ **Completed Requirements:**
- ✅ POST `/api/guest/suggest-song` endpoint created
- ✅ Invite token validation implemented
- ✅ Writes to `events/{eventId}/songs` with `addedByType="guest"`
- ✅ Optionally writes to `songRequests` for approval workflow
- ✅ Frontend `/request-song/[eventId]` updated to use new API

## Prerequisites

1. **Authentication**: You need to be logged in as a user with access to an event (DJ, client, or admin)
2. **Event**: You need an existing event in Firestore
3. **Development Server**: Make sure your Next.js dev server is running

## Testing Steps

### Step 1: Create an Invite Token

1. Navigate to the dashboard for an event:
   ```
   http://localhost:3000/dashboard/[eventId]/invites
   ```
   Replace `[eventId]` with an actual event ID from your database.

2. Click "Create Invite" button

3. Fill in the form (optional fields):
   - **Expires At**: Leave empty for no expiration, or set a future date
   - **Max Uses**: Leave empty for unlimited, or set a number (e.g., 5)
   - **Guest Name**: Optional
   - **Custom Message**: Optional

4. Click "Create Invite"

5. **Copy the invite URL** or **copy the token** from the modal

### Step 2: Test the API Endpoint Directly

You can test the API endpoint using curl or a tool like Postman:

```bash
curl -X POST http://localhost:3000/api/guest/suggest-song \
  -H "Content-Type: application/json" \
  -d '{
    "token": "YOUR_TOKEN_HERE",
    "songTitle": "Test Song",
    "artist": "Test Artist",
    "guestName": "John Doe"
  }'
```

**Expected Response (Success):**
```json
{
  "success": true,
  "songId": "abc123...",
  "requestId": "xyz789..."
}
```

**Expected Response (Invalid Token):**
```json
{
  "success": false,
  "error": "Invalid token"
}
```

### Step 3: Test via Frontend UI

1. Open the invite URL in an **incognito/private browser window** (to simulate a guest without login):
   ```
   http://localhost:3000/request-song/[eventId]?token=YOUR_TOKEN_HERE
   ```

2. Fill in the form:
   - **Your Name**: Enter a guest name (e.g., "Jane Smith")
   - **Song Title**: Enter a song title (e.g., "Dancing Queen")
   - **Artist**: Enter an artist name (e.g., "ABBA")

3. Click "Submit Request"

4. You should see a success message: "Request Submitted!"

### Step 4: Verify Data in Firestore

Check that the data was written correctly:

1. **Check `events/{eventId}/songs` collection:**
   - Navigate to Firestore Console
   - Go to `events` → `[eventId]` → `songs`
   - Find the newly created song document
   - Verify the following fields:
     - `title`: Should match the submitted song title
     - `artist`: Should match the submitted artist
     - `addedByType`: Should be `"guest"`
     - `addedByGuestName`: Should match the submitted guest name
     - `tag`: Should be `"neutral"`
     - `sourceType`: Should be `"manual"`
     - `voteCount`: Should be `0`
     - `createdAt`: Should be a recent timestamp

2. **Check `songRequests` collection (optional):**
   - Navigate to `songRequests` collection
   - Find the request document (if `createRequest` was true)
   - Verify:
     - `eventId`: Matches the event ID
     - `songTitle`: Matches the submitted title
     - `artist`: Matches the submitted artist
     - `guestName`: Matches the submitted guest name
     - `status`: Should be `"pending"`
     - `songId`: Should link to the song in `events/{eventId}/songs`

### Step 5: Test Error Cases

#### Test Invalid Token
```bash
curl -X POST http://localhost:3000/api/guest/suggest-song \
  -H "Content-Type: application/json" \
  -d '{
    "token": "invalid_token_12345",
    "songTitle": "Test",
    "artist": "Test",
    "guestName": "Test"
  }'
```
**Expected:** `401` status with `"Invalid token"` error

#### Test Missing Fields
```bash
curl -X POST http://localhost:3000/api/guest/suggest-song \
  -H "Content-Type: application/json" \
  -d '{
    "token": "valid_token",
    "songTitle": "Test"
  }'
```
**Expected:** `400` status with `"Missing required fields"` error

#### Test Expired Token
1. Create an invite with an expiration date in the past
2. Try to submit a song request
**Expected:** `403` status with `"This invite has expired"` error

#### Test Revoked Token
1. Create an invite
2. Revoke it via the dashboard
3. Try to submit a song request
**Expected:** `403` status with `"This invite has been revoked"` error

#### Test Rate Limiting
1. Submit a song request
2. Immediately submit another request (within 30 seconds)
**Expected:** `429` status with `"Please wait before submitting another request"` error

#### Test Max Uses
1. Create an invite with `maxUses: 1`
2. Submit a song request (should succeed)
3. Submit another song request
**Expected:** `403` status with `"This invite has reached its maximum number of uses"` error

### Step 6: Test Without songRequests (Optional)

To test with `createRequest: false`, modify the API call:

```bash
curl -X POST http://localhost:3000/api/guest/suggest-song \
  -H "Content-Type: application/json" \
  -d '{
    "token": "YOUR_TOKEN_HERE",
    "songTitle": "Test Song",
    "artist": "Test Artist",
    "guestName": "John Doe",
    "createRequest": false
  }'
```

**Expected:** Response should have `songId` but `requestId` should be `null`

## Verification Checklist

- [ ] API endpoint `/api/guest/suggest-song` exists and responds
- [ ] Token validation works (invalid tokens are rejected)
- [ ] Expired tokens are rejected
- [ ] Revoked tokens are rejected
- [ ] Rate limiting works (30-second cooldown)
- [ ] Max uses enforcement works
- [ ] Songs are written to `events/{eventId}/songs` with correct fields
- [ ] `addedByType` is set to `"guest"`
- [ ] `addedByGuestName` is populated correctly
- [ ] Song requests are optionally created in `songRequests` collection
- [ ] Frontend form submits successfully
- [ ] Success message displays after submission
- [ ] Error messages display for invalid inputs

## Troubleshooting

### Issue: "Invalid token" error
- **Solution**: Make sure you're using the exact token from the invite creation modal. Tokens are case-sensitive.

### Issue: Songs not appearing in Firestore
- **Solution**: Check Firestore security rules allow writes to `events/{eventId}/songs`. Check server logs for errors.

### Issue: Frontend shows error but API works
- **Solution**: Check browser console for JavaScript errors. Verify the API route path matches exactly.

### Issue: Rate limiting too strict
- **Solution**: The 30-second cooldown is hardcoded. You can modify it in `/app/api/guest/suggest-song/route.ts` line 84.

## Notes

- The old route `/api/guest/song-request` still exists but is deprecated. The new route `/api/guest/suggest-song` is the primary endpoint.
- Songs are always written to `events/{eventId}/songs` (required)
- Song requests are optionally written to `songRequests` (for approval workflow)
- All guest submissions have `tag: "neutral"` by default
