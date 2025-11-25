import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

function getPrivateKey(): string | undefined {
  const rawKey =
    process.env.FIREBASE_PRIVATE_KEY ||
    (process.env.FIREBASE_PRIVATE_KEY_BASE64
      ? Buffer.from(process.env.FIREBASE_PRIVATE_KEY_BASE64, 'base64').toString('utf8')
      : undefined);

  if (!rawKey) return undefined;

  // Remove surrounding quotes/backticks and normalize escaped newlines.
  return rawKey
    .replace(/^['"`](.*)['"`]$/s, '$1')
    .replace(/\\n/g, '\n')
    .trim();
}

let adminApp: App;
let adminAuth: ReturnType<typeof getAuth>;
let adminDb: ReturnType<typeof getFirestore>;

if (!getApps().length) {
  const privateKey = getPrivateKey();

  if (!privateKey) {
    throw new Error('Missing FIREBASE_PRIVATE_KEY (or FIREBASE_PRIVATE_KEY_BASE64) env var for Firebase Admin SDK.');
  }

  const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey,
  };

  adminApp = initializeApp({
    credential: cert(serviceAccount as any),
    projectId: process.env.FIREBASE_PROJECT_ID,
  });

  adminAuth = getAuth(adminApp);
  adminDb = getFirestore(adminApp);
} else {
  adminApp = getApps()[0];
  adminAuth = getAuth(adminApp);
  adminDb = getFirestore(adminApp);
}

export { adminAuth, adminDb };
export default adminApp;
