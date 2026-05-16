import admin from "firebase-admin";
import { type Firestore } from "firebase-admin/firestore";
/**
 * Initializes Firebase Admin from env vars.
 * Stub-friendly: logs and skips full init if credentials are missing (local dev).
 */
declare function initFirebase(): Firestore;
/** Firestore instance — call initFirebase() once at app startup if you prefer lazy init */
declare const firestore: admin.firestore.Firestore;
export { initFirebase, firestore as db };
//# sourceMappingURL=firebase-config.d.ts.map