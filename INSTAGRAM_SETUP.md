# Instagram Feed Setup

The homepage shows the latest posts from [@mixd_chicago](https://www.instagram.com/mixd_chicago) using the official Instagram API (the "Instagram API with Instagram Login" — Meta retired the old Basic Display API in December 2024).

If no access token is configured, the section simply doesn't render — nothing breaks.

## Requirements

- The Instagram account must be a **professional account** (Business or Creator). You can switch a personal account for free in the Instagram app under **Settings → Account type and tools → Switch to professional account**.
- A Meta developer account (free): https://developers.facebook.com

## 1. Create a Meta app

1. Go to https://developers.facebook.com/apps and click **Create App**.
2. When asked what you're building, choose **Other** → app type **Business** (or follow the "Instagram" use case if offered).
3. Once the app is created, find **Instagram** in the product list and click **Set up**.
4. Choose **API setup with Instagram login** (no Facebook Page required).

## 2. Generate a long-lived access token

1. In the app dashboard, go to **Instagram → API setup with Instagram login**.
2. Under **Generate access tokens**, click **Add account** and log in with the `mixd_chicago` Instagram account.
3. Click **Generate token** next to the account and copy it.

This is a **long-lived token** (valid for 60 days).

## 3. Configure the environment variable

Add the token to `.env.local` (and to your production environment config):

```bash
INSTAGRAM_ACCESS_TOKEN=IGAAR...
```

Restart the dev server and the feed will appear on the homepage.

## Token refresh (automatic)

Long-lived tokens expire after 60 days, but the site refreshes them automatically:

- `lib/instagram.ts` refreshes the token roughly once a week and stores the newest token in Firestore at `config/instagram`.
- The env var is only used to **seed the first token**. After the first successful refresh, Firestore always holds the freshest token.
- The only way the token can die is if the site gets zero homepage traffic for 60+ days, or the Instagram account password/permissions change. If that happens, generate a new token (step 2) and update `INSTAGRAM_ACCESS_TOKEN`, then delete the `config/instagram` document in Firestore so the new env token is picked up.

## Caching

Posts are cached for 1 hour (`revalidate: 3600`), so new Instagram posts show up on the site within an hour without hammering the API.

## Troubleshooting

- **Section not showing:** check the server logs — `lib/instagram.ts` logs any token or API errors prefixed with `Instagram:`.
- **`Error validating access token`:** the token expired or was revoked. Regenerate it (step 2), update the env var, and delete the `config/instagram` Firestore doc.
- **Images not loading:** Instagram CDN URLs expire after a while. They're refetched on every 1-hour revalidation, so this should resolve itself; a hard refresh after a deploy also clears it.
