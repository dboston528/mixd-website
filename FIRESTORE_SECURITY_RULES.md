# Firestore Security Rules - Production

Copy and paste these rules into Firebase Console > Firestore Database > Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper function to check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Helper function to get user role
    function getUserRole() {
      let userDoc = get(/databases/$(database)/documents/users/$(request.auth.uid));
      return userDoc != null ? userDoc.data.role : null;
    }
    
    // Helper to check if user is admin
    function isAdmin() {
      return getUserRole() == 'admin';
    }
    
    // Helper to check if user is DJ
    function isDJ() {
      return getUserRole() == 'dj';
    }
    
    // Helper to check if user owns event
    function isEventOwner(eventId) {
      let event = get(/databases/$(database)/documents/events/$(eventId));
      return event != null && event.data.userId == request.auth.uid;
    }
    
    // Helper to check if user is assigned to event as DJ
    function isAssignedDJ(eventId) {
      let event = get(/databases/$(database)/documents/events/$(eventId));
      return event != null && 
             event.data.assignedDJs != null &&
             request.auth.uid in event.data.assignedDJs;
    }
    
    // Helper to check if user is a member of event via eventMembers
function isEventMember(eventId) {
  let memberDocId = request.auth.uid + '_' + eventId;
  return exists(/databases/$(database)/documents/eventMembers/$(memberDocId));
}
    
    // Helper to check if user can access event
    function canAccessEvent(eventId) {
      return isAdmin() || 
             isEventOwner(eventId) || 
             (isDJ() && isAssignedDJ(eventId)) ||
             isEventMember(eventId);
    }
    
    // Users collection for roles
    match /users/{userId} {
      allow read: if isAuthenticated() && (request.auth.uid == userId || isAdmin());
      allow create: if isAuthenticated() && request.auth.uid == userId;
      // Users can update their own doc but cannot change their own role.
      // Only admins can change the role field.
      allow update: if isAuthenticated() && (
        (request.auth.uid == userId &&
         !request.resource.data.diff(resource.data).affectedKeys().hasAny(['role'])) ||
        isAdmin()
      );
    }
    
    // Events: Owners, assigned DJs, and admins can access
    match /events/{eventId} {
      allow read: if isAuthenticated() && canAccessEvent(eventId);
      allow create: if isAuthenticated() && 
        request.resource.data.userId == request.auth.uid &&
        request.resource.data.assignedDJs is list;
      allow update: if isAuthenticated() && 
        (isEventOwner(eventId) || isAdmin());
      allow delete: if isAuthenticated() && 
        (isEventOwner(eventId) || isAdmin());
    }
    
    // Playlists: Access based on event access
    match /playlists/{playlistId} {
      allow read: if isAuthenticated() && canAccessEvent(resource.data.eventId);
      allow create: if isAuthenticated() && 
        canAccessEvent(request.resource.data.eventId);
      allow update, delete: if isAuthenticated() && 
        canAccessEvent(resource.data.eventId);
    }
    
    // Song Requests: 
    // - Only Admin SDK can create (via API with token validation)
    // - Only event owners, assigned DJs, and admins can read/update
    match /songRequests/{requestId} {
      allow create: if false; // Guests no longer write directly - only Admin SDK via API
      allow read: if isAuthenticated() && canAccessEvent(resource.data.eventId);
      allow update: if isAuthenticated() && 
        canAccessEvent(resource.data.eventId) &&
        request.resource.data.diff(resource.data).affectedKeys().hasOnly(['status']);
    }
    
    // Invites: Token-based guest access
    match /invites/{inviteId} {
      // Only authenticated users can read their event's invites
      allow read: if isAuthenticated() && 
        canAccessEvent(resource.data.eventId);
      // Only event owners/DJs/admins can create invites
      allow create: if isAuthenticated() && 
        canAccessEvent(request.resource.data.eventId) &&
        request.resource.data.tokenHash is string &&
        request.resource.data.eventId is string &&
        request.resource.data.createdBy == request.auth.uid;
      // Only event owners/DJs/admins can update (revoke, track usage)
      allow update: if isAuthenticated() && 
        canAccessEvent(resource.data.eventId) &&
        request.resource.data.diff(resource.data).affectedKeys().hasOnly(['revoked', 'useCount', 'lastUsedAt']);
      // No delete (use revocation instead)
      allow delete: if false;
    }
    
    // Timeline Items: Access based on event access
    match /timelineItems/{itemId} {
      allow read: if isAuthenticated() && canAccessEvent(resource.data.eventId);
      allow create: if isAuthenticated() && 
        canAccessEvent(request.resource.data.eventId);
      allow update, delete: if isAuthenticated() && 
        canAccessEvent(resource.data.eventId);
    }
    
    // Event Members: Access based on event access and admin permissions
    // Uses composite document ID: userId_eventId
    match /eventMembers/{memberId} {
      // Users can read if they're admin or the member themselves
      // Removed isEventOwner check to avoid circular dependency with event reads
      allow read: if isAuthenticated() && (
        isAdmin() || 
        resource.data.userId == request.auth.uid
      );
      // Only admins can create/update event members
      // Document ID must match pattern: userId_eventId
      allow create: if isAuthenticated() && isAdmin() &&
        request.resource.data.eventId is string &&
        request.resource.data.userId is string &&
        request.resource.data.role in ['client', 'dj', 'admin'] &&
        memberId == request.resource.data.userId + '_' + request.resource.data.eventId;
      allow update: if isAuthenticated() && isAdmin();
      allow delete: if isAuthenticated() && isAdmin();
    }
    
    // Event Songs: Access based on event access
    // Subcollection under events: events/{eventId}/songs/{songId}
    match /events/{eventId}/songs/{songId} {
      allow read: if isAuthenticated() && canAccessEvent(eventId);
      allow create: if isAuthenticated() && canAccessEvent(eventId);
      allow update: if isAuthenticated() && canAccessEvent(eventId) &&
        // Only allow updating specific fields (not addedBy fields for audit integrity)
        request.resource.data.diff(resource.data).affectedKeys()
          .hasOnly(['title', 'artist', 'tag', 'sourceType', 'sourceId', 
                   'sourceUrl', 'notes', 'voteCount', 'updatedAt']);
      allow delete: if isAuthenticated() && canAccessEvent(eventId);
    }
    
    // Deny all other access
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## Notes

- Users collection stores role information (client, dj, admin)
- Events can have assignedDJs array
- DJs can access events they're assigned to
- Admins can access all events
- Event owners can always access their events

