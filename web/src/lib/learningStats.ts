import {
  doc,
  setDoc,
  onSnapshot,
  serverTimestamp,
  increment,
  FieldValue,
  FirestoreError,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

/** Statistik penguasaan satu huruf */
export interface LetterStat {
  seen: number;
  correct: number;
}

/** Statistik belajar agregat per user */
export interface LearningStats {
  gamesPlayed: number;
  totalAnswered: number;
  totalCorrect: number;
  letters: Record<string, LetterStat>;
}

/** Hasil satu soal dalam sesi quiz */
export interface SessionAnswer {
  labelId: number;
  correct: boolean;
}

/**
 * Simpan hasil satu sesi quiz ke statistik belajar (increment, akumulatif).
 * Dokumen: learning_stats/{uid}. Aman dipanggil berulang — pakai merge + increment.
 */
export async function saveLearningSession(
  uid: string,
  answers: SessionAnswer[]
): Promise<void> {
  if (answers.length === 0) return;

  const seenCount: Record<number, number> = {};
  const correctCount: Record<number, number> = {};
  let totalCorrect = 0;
  for (const a of answers) {
    seenCount[a.labelId] = (seenCount[a.labelId] ?? 0) + 1;
    if (a.correct) {
      correctCount[a.labelId] = (correctCount[a.labelId] ?? 0) + 1;
      totalCorrect++;
    }
  }

  const letters: Record<string, { seen: FieldValue; correct: FieldValue }> = {};
  for (const idStr of Object.keys(seenCount)) {
    const id = Number(idStr);
    letters[idStr] = {
      seen: increment(seenCount[id]),
      correct: increment(correctCount[id] ?? 0),
    };
  }

  await setDoc(
    doc(db, "learning_stats", uid),
    {
      userId: uid,
      gamesPlayed: increment(1),
      totalAnswered: increment(answers.length),
      totalCorrect: increment(totalCorrect),
      letters,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

/**
 * Langganan realtime statistik belajar milik user.
 * Memanggil onData(null) bila belum ada data.
 */
export function subscribeLearningStats(
  uid: string,
  onData: (stats: LearningStats | null) => void,
  onError?: (err: FirestoreError) => void
): () => void {
  return onSnapshot(
    doc(db, "learning_stats", uid),
    (snap) => {
      if (!snap.exists()) {
        onData(null);
        return;
      }
      const d = snap.data();
      onData({
        gamesPlayed: (d.gamesPlayed as number) ?? 0,
        totalAnswered: (d.totalAnswered as number) ?? 0,
        totalCorrect: (d.totalCorrect as number) ?? 0,
        letters: (d.letters as Record<string, LetterStat>) ?? {},
      });
    },
    onError
  );
}
