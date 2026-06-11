const GRAPH_BASE = "https://graph.instagram.com";

// Long-lived Instagram tokens expire after 60 days. We refresh roughly weekly
// and persist the newest token in Firestore so the env var only seeds the
// very first token and never needs manual rotation afterwards.
const REFRESH_INTERVAL_MS = 7 * 24 * 60 * 60 * 1000;
const TOKEN_COLLECTION = "config";
const TOKEN_DOC = "instagram";

export type InstagramPost = {
  id: string;
  caption: string;
  imageUrl: string;
  permalink: string;
  mediaType: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  timestamp: string;
};

type StoredToken = {
  accessToken: string;
  refreshedAt: number;
};

async function getTokenDoc() {
  // Lazy import so pages using this module can still build/render gracefully
  // if Firebase Admin env vars are missing.
  const { adminDb } = await import("./firebase-admin");
  return adminDb.collection(TOKEN_COLLECTION).doc(TOKEN_DOC);
}

async function refreshToken(accessToken: string): Promise<string | null> {
  try {
    const res = await fetch(
      `${GRAPH_BASE}/refresh_access_token?grant_type=ig_refresh_token&access_token=${encodeURIComponent(accessToken)}`,
      { cache: "no-store" }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.access_token ?? null;
  } catch {
    return null;
  }
}

async function getAccessToken(): Promise<string | null> {
  const envToken = process.env.INSTAGRAM_ACCESS_TOKEN || null;

  let stored: StoredToken | null = null;
  let docRef: Awaited<ReturnType<typeof getTokenDoc>> | null = null;

  try {
    docRef = await getTokenDoc();
    const snap = await docRef.get();
    if (snap.exists) stored = snap.data() as StoredToken;
  } catch (error) {
    console.error("Instagram: could not read token from Firestore", error);
  }

  const current = stored?.accessToken || envToken;
  if (!current) return null;

  const isStale = !stored || Date.now() - stored.refreshedAt > REFRESH_INTERVAL_MS;
  if (isStale && docRef) {
    // Refresh fails harmlessly if the token is less than 24h old; we just
    // keep using the current token and try again next time.
    const refreshed = await refreshToken(current);
    if (refreshed) {
      try {
        await docRef.set({ accessToken: refreshed, refreshedAt: Date.now() });
      } catch (error) {
        console.error("Instagram: could not persist refreshed token", error);
      }
      return refreshed;
    }
  }

  return current;
}

export async function getInstagramPosts(limit = 8): Promise<InstagramPost[]> {
  try {
    const token = await getAccessToken();
    if (!token) return [];

    const fields = "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp";
    const res = await fetch(
      `${GRAPH_BASE}/me/media?fields=${fields}&limit=${limit}&access_token=${encodeURIComponent(token)}`,
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) {
      console.error("Instagram: media request failed", res.status, await res.text());
      return [];
    }

    const data = await res.json();
    const items: any[] = data.data ?? [];

    return items
      .map((item) => ({
        id: item.id,
        caption: item.caption ?? "",
        // Videos expose a thumbnail_url; images and carousels use media_url.
        imageUrl: item.media_type === "VIDEO" ? item.thumbnail_url : item.media_url,
        permalink: item.permalink,
        mediaType: item.media_type,
        timestamp: item.timestamp,
      }))
      .filter((post) => Boolean(post.imageUrl))
      .slice(0, limit);
  } catch (error) {
    console.error("Instagram: failed to load posts", error);
    return [];
  }
}
