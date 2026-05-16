/**
 * Firebase Admin + Firestore
 * Reads service-account fields from env. Safe to import without credentials (stub mode).
 */
import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';

const { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY } =
  process.env;

/**
 * Normalize private key newlines when stored as a single-line env var.
 */
function formatPrivateKey(key) {
  if (!key) return undefined;
  return key.replace(/\\n/g, '\n');
}

/**
 * Initialize Firebase Admin once; returns Firestore or null in stub mode.
 */
function initFirebase() {
  if (admin.apps.length > 0) {
    return getFirestore();
  }

  const hasCredentials =
    FIREBASE_PROJECT_ID && FIREBASE_CLIENT_EMAIL && FIREBASE_PRIVATE_KEY;

  if (!hasCredentials) {
    console.log(
      '[Firebase] Stub mode — set FIREBASE_* in .env to enable Firestore.'
    );
    return null;
  }

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: FIREBASE_PROJECT_ID,
      clientEmail: FIREBASE_CLIENT_EMAIL,
      privateKey: formatPrivateKey(FIREBASE_PRIVATE_KEY),
    }),
  });

  console.log(
    `[Firebase] Initialized (stub ready) — project: ${FIREBASE_PROJECT_ID}`
  );

  return getFirestore();
}

/** Firestore instance; null until credentials are configured */
export const db = initFirebase();

export default admin;
