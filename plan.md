# Product Requirements Document (PRD)

## Product Name (Working)
VibePlan (placeholder)

## Product Type
DJ Music Planning & Event Collaboration Platform  
(Web-first, Mobile responsive)

---

## 1. Product Overview

### Problem Statement
Clients and DJs struggle to collaborate effectively on music planning, timelines, and event details. Current workflows rely on spreadsheets, emails, and text messages, causing miscommunication, last-minute changes, and poor event execution.

### Solution
A centralized planning platform that allows:
- Clients to plan music and timelines
- Guests to suggest and vote on songs without creating accounts
- DJs to manage multiple events efficiently
- Clean export of finalized plans for performance prep

---

## 2. Goals & Success Metrics

### Business Goals
- Reduce DJ/client planning friction
- Improve event execution quality
- Create a professional, repeatable DJ workflow
- Serve as the “single source of truth” for event music

### Success Metrics (KPIs)
- % of events finalized before event date
- Avg. number of songs added per event
- Guest engagement rate
- DJ retention rate
- Export usage rate

---

## 3. User Personas

### DJ (Primary User)
- Manages multiple events
- Needs structure, clarity, and exports

**Pain Points**
- Disorganized client notes
- Last-minute song changes
- No standardized planning process

---

### Client / Host
- Wedding couples or event hosts
- Wants control without complexity

**Pain Points**
- Unsure what to plan
- Hard to communicate preferences clearly

---

### Guest (No Login)
- Friends/family suggesting music
- Very limited permissions

---

## 4. User Roles & Permissions

| Role | Permissions |
|----|----|
| DJ | Full access to assigned events |
| Client | Edit playlist, timeline, questionnaire |
| Guest | Suggest/vote on songs only |
| Admin | Platform management |

---

## 5. Core Features (MVP)

---

## 5.1 Event Management

### Requirements
- Create, edit, archive events
- Assign DJs and clients

### Event Fields
- Name
- Type (wedding, birthday, corporate)
- Date
- Venue
- Status (draft, in_progress, finalized, archived)

---

## 5.2 Timeline Builder

### Description
Visual timeline broken into event moments.

### Example Moments
- Ceremony
- Cocktail Hour
- Introductions
- First Dance
- Dinner
- Open Dancing

### Requirements
- Add/edit/delete moments
- Reorder moments
- Assign songs to moments
- Client notes vs DJ private notes

---

## 5.3 Playlist & Song Management

### Song Fields
- Title
- Artist
- Source (Spotify, Apple Music, YouTube, manual)
- Tag:
  - must_play
  - play_if_possible
  - do_not_play
- Notes
- Added by (DJ / Client / Guest)

### Requirements
- Add/remove songs
- Sort & filter by tag
- Guest voting
- Vote count aggregation

---

## 5.4 Guest Collaboration (No Login)

### Requirements
- Shareable invite link
- No account required
- Suggest songs
- Vote on songs
- Server-side validation

---

## 5.5 Questionnaires & Preferences

### Purpose
Collect structured planning data from clients.

### Example Questions
- Favorite genres
- Must-play artists
- Do-not-play artists
- Clean vs explicit music
- Desired vibe

### Requirements
- Templates
- DJ-custom questions
- Required vs optional

---

## 5.6 DJ Dashboard

### Requirements
- View all assigned events
- Status indicators
- Quick access to timeline, playlist, notes

---

## 5.7 Export & DJ Prep

### MVP
- CSV export
- PDF summary

### Future
- Serato
- Rekordbox
- Traktor

---

## 6. Platform & UX

### Platforms
- Web app (MVP)
- Mobile responsive
- Native apps (future)

### UX Principles
- Guided setup
- Minimal jargon
- Progress indicators

---

## 7. Tech Stack (Suggested)

### Frontend
- Next.js
- Tailwind CSS

### Backend
- Firebase Auth
- Firestore
- Firebase Storage

### Permissions
- Role-based access control (RBAC)

---

## 8. MVP Scope

### In Scope
- Event management
- Timeline builder
- Playlist management
- Guest song suggestions
- Guest voting
- DJ dashboard
- Export

### Out of Scope (V1)
- Payments
- Contracts
- Messaging
- AI features
- Native apps

---

## 9. Roadmap

### Phase 1 (0–3 months)
- Core planning features
- Web-only MVP

### Phase 2 (3–6 months)
- Music API integrations
- DJ software exports
- Analytics

### Phase 3 (6–12 months)
- Payments
- Vendor tools
- AI planning assistant

---

## 10. Monetization

### Free
- Limited events

### Pro DJ
- Monthly subscription
- Unlimited events
- Branding
- Export tools

---

## 11. Database Schema (Firestore)

### Collections
- users
- events
- events/{eventId}/timelineMoments
- events/{eventId}/songs
- events/{eventId}/songs/{songId}/votes
- events/{eventId}/questionnaire
- events/{eventId}/questionnaireResponses
- invites

---

### users/{userId}
- displayName
- email
- role (dj | client | admin)
- createdAt
- updatedAt

---

### events/{eventId}
- name
- type
- date
- venueName
- status
- ownerClientId
- assignedDjIds[]
- collaboratorClientIds[]
- guestAccessEnabled
- guestVotingEnabled
- createdAt
- updatedAt

---

### timelineMoments/{momentId}
- title
- order
- songIds[]
- clientNotes
- djPrivateNotes
- createdAt
- updatedAt

---

### songs/{songId}
- title
- artist
- sourceType
- sourceId
- tag
- notes
- addedByType
- addedByUserId
- addedByGuestName
- voteCount
- createdAt

---

### votes/{voteId}
- voterType
- voterUserId
- voterGuestTokenHash
- createdAt

---

### questionnaire/{questionId}
- prompt
- type
- options[]
- required
- order

---

### questionnaireResponses/{responseId}
- questionId
- answer
- answeredByUserId
- createdAt

---

### invites/{inviteId}
- eventId
- token
- expiresAt
- revoked
- useCount
- maxUses
- createdAt

---

## 12. Guest Access (No Login)

### Summary
- Guests do not authenticate
- Guests never access Firestore directly
- Guests interact only via server endpoints
- Token-based access

### Flow
1. DJ generates invite
2. Guest opens link with token
3. Frontend calls server API
4. Server validates token
5. Server writes to Firestore via Admin SDK

---

## 13. Security Rules (High-Level)

### DJs & Clients
- Authenticated via Firebase Auth
- Access limited by event ownership/assignment

### Guests
- No Firestore access
- Server-side validation only

---

## 14. Guest API Endpoints

### POST /api/guest/suggest-song
- Validate token
- Check limits
- Create song doc

### POST /api/guest/vote
- Validate token
- Prevent duplicate votes
- Increment voteCount

---

## 15. Open Questions

- Should clients be able to vote?
- Who owns the event by default?
- Enforce song limits?

---

## 16. Next Steps

- Finalize MVP scope
- Write Firestore rules
- Create API contracts
- Design wireframes
- Begin implementation

---

# Implementation Status (Current Codebase)

The following features are already implemented or partially implemented.
This section documents the current state for alignment with the PRD.

## Implemented

### Authentication & Roles
- Email/password login and Google OAuth
- Users stored in `users/{userId}` with role field (`client`, `dj`, `admin`)
- Admin user management page for role changes
- Event-level roles via `eventMembers` collection

### Event Management (Partial)
- Event creation and editing
- Assigned DJs via `assignedDJs` array
- Client/event membership via `eventMembers`
- Dashboard views for admin, DJ, and client

### Playlist Management (Partial)
- Manual song entry
- Spotify playlist import
- Songs stored as arrays in `playlists` documents
- Separate `mustPlayList` and `doNotPlayList` arrays on event

### Timeline Builder (Partial)
- Timeline items with time, title, description
- Reordering via `order` field
- Single flat timeline per event

### Guest Song Requests (Partial)
- Public `/request-song/[eventId]` page
- No authentication required
- Creates `songRequests` documents with approval flow

## Missing or Incomplete (Relative to PRD)

- Event status workflow (`draft`, `in_progress`, `finalized`, `archived`)
- Unified event-level song collection
- Song tagging system
- Guest voting on songs
- Token-based guest access
- Questionnaire system
- Export (CSV/PDF)
- DJ private notes vs client notes separation

---

# Retrofit Plan (Incremental & Backward-Compatible)

## Principles
- Do not rename or remove existing routes
- Prefer adding new collections/fields over modifying existing ones
- Keep existing UI functional during migration
- All guest writes must go through server APIs

## Retrofit Order

### Phase 1: Core Data Model Enhancements
1. Add `status`, `venueName`, and `updatedAt` fields to `events`
2. Introduce `events/{eventId}/songs` subcollection
3. Keep existing playlists and songRequests operational

### Phase 2: Guest Access Hardening
1. Add `invites` collection with token-based access
2. Replace direct guest Firestore writes with server API routes
3. Enable guest voting on songs

### Phase 3: Timeline Enhancements
1. Extend timeline items with momentType
2. Add clientNotes and djPrivateNotes
3. Support linking songs to timeline items

### Phase 4: Planning & Export Tools
1. Questionnaire system
2. CSV export
3. PDF summary export

## Migration Notes
- Existing `mustPlayList` and `doNotPlayList` arrays will be migrated to song tags
- Existing `songRequests` can be dual-written during transition
- Missing fields should be treated as defaults in UI logic

---

# Development Workflow Notes

- All changes should be implemented as additive, minimal diffs
- Cursor prompts must analyze existing code before modifying
- Each retrofit step should be independently shippable
