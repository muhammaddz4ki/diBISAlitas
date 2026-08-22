/**
 * Seed admin — membuat/menyiapkan akun admin diBISAlitas secara aman (Firebase Admin SDK).
 *
 * Cara pakai:
 *   1. Firebase Console → Project Settings → Service accounts → "Generate new private key"
 *      → simpan sebagai  web/scripts/serviceAccountKey.json  (JANGAN commit — sudah di-gitignore).
 *   2. cd web && npm i firebase-admin
 *   3. (opsional) set password sendiri:  export ADMIN_PASSWORD="passwordKuatAnda"
 *   4. node scripts/seed-admin.mjs
 *
 * Script ini idempotent: aman dijalankan berulang.
 */
import admin from "firebase-admin";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

const EMAIL = process.env.ADMIN_EMAIL || "admin@dibisalitas.com";
const PASSWORD = process.env.ADMIN_PASSWORD || "diBISAlitas#Admin2026"; // ⚠️ ganti setelah login pertama
const DISPLAY_NAME = "Administrator";

const serviceAccount = JSON.parse(
  readFileSync(join(__dirname, "serviceAccountKey.json"), "utf8")
);

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const auth = admin.auth();
const db = admin.firestore();

async function main() {
  let user;
  try {
    user = await auth.getUserByEmail(EMAIL);
    console.log(`ℹ️  Akun sudah ada: ${user.uid} — memperbarui password & profil.`);
    await auth.updateUser(user.uid, { password: PASSWORD, displayName: DISPLAY_NAME });
  } catch {
    user = await auth.createUser({ email: EMAIL, password: PASSWORD, displayName: DISPLAY_NAME });
    console.log(`✅ Akun dibuat: ${user.uid}`);
  }

  // Custom claim (opsional, berguna untuk rules berbasis claim / App Check)
  await auth.setCustomUserClaims(user.uid, { admin: true });

  // Dokumen Firestore — INILAH yang dibaca guard admin (role === "admin")
  await db.collection("users").doc(user.uid).set(
    {
      name: DISPLAY_NAME,
      fullName: DISPLAY_NAME,
      email: EMAIL,
      role: "admin",
      isAdmin: true,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    { merge: true }
  );

  console.log("\n✅ Admin siap. Login di /admin/login:");
  console.log(`   Email    : ${EMAIL}`);
  console.log(`   Password : ${PASSWORD}`);
  console.log("⚠️  Ganti password ini setelah login pertama (menu Pengaturan Profil).\n");
  process.exit(0);
}

main().catch((e) => {
  console.error("❌ Gagal seed admin:", e);
  process.exit(1);
});
