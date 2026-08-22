import {
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  FirestoreError,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

/** ID kuis saat ini (Hijaiyah). Disiapkan agar mudah ditambah kuis lain nanti. */
export const QUIZ_ID = "hijaiyah";

export interface QuizScoreEntry {
  id: string;
  userId: string;
  userName: string;
  quizId: string;
  score: number;
  correctCount: number;
  totalQuestions: number;
  bestStreak: number;
  updatedAt: Timestamp | null;
}

export interface SaveScoreInput {
  uid: string;
  userName: string;
  score: number;
  correctCount: number;
  totalQuestions: number;
  bestStreak: number;
}

/**
 * Simpan skor sebagai "personal best" (1 dokumen per user per kuis).
 * Hanya menimpa bila skor baru lebih tinggi dari rekor sebelumnya.
 */
export async function saveQuizScore(
  input: SaveScoreInput
): Promise<{ isNewBest: boolean; best: number }> {
  const docId = `${input.uid}_${QUIZ_ID}`;
  const ref = doc(db, "quiz_scores", docId);
  const snap = await getDoc(ref);
  const prevBest =
    snap.exists() && typeof snap.data().score === "number"
      ? (snap.data().score as number)
      : -1;

  if (input.score > prevBest) {
    await setDoc(ref, {
      userId: input.uid,
      userName: input.userName,
      quizId: QUIZ_ID,
      score: input.score,
      correctCount: input.correctCount,
      totalQuestions: input.totalQuestions,
      bestStreak: input.bestStreak,
      updatedAt: serverTimestamp(),
    });
    return { isNewBest: true, best: input.score };
  }
  return { isNewBest: false, best: prevBest };
}

/**
 * Langganan realtime papan peringkat (skor tertinggi lebih dulu).
 * Mengembalikan fungsi unsubscribe.
 */
export function subscribeLeaderboard(
  onData: (entries: QuizScoreEntry[]) => void,
  onError?: (err: FirestoreError) => void,
  max = 20
): () => void {
  const q = query(
    collection(db, "quiz_scores"),
    orderBy("score", "desc"),
    limit(max)
  );
  return onSnapshot(
    q,
    (snap) => {
      const entries: QuizScoreEntry[] = [];
      snap.forEach((d) => {
        const data = d.data();
        entries.push({
          id: d.id,
          userId: (data.userId as string) ?? "",
          userName: (data.userName as string) ?? "Anonim",
          quizId: (data.quizId as string) ?? QUIZ_ID,
          score: (data.score as number) ?? 0,
          correctCount: (data.correctCount as number) ?? 0,
          totalQuestions: (data.totalQuestions as number) ?? 0,
          bestStreak: (data.bestStreak as number) ?? 0,
          updatedAt: (data.updatedAt as Timestamp) ?? null,
        });
      });
      onData(entries);
    },
    onError
  );
}
