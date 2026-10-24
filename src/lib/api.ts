import type { AnswerResult, Me, Question, Topic, TopicProgress } from "../../shared/api";
import type { Answer } from "../../shared/grade";

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`/api${path}`, { credentials: "same-origin" });
  if (!res.ok) throw new Error(`${path}: ${res.status}`);
  return res.json() as Promise<T>;
}

export const api = {
  me: () => get<Me | null>("/me"),
  topics: () => get<{ currentWeek: number; topics: Topic[] }>("/topics"),
  questions: (topic?: string) => get<Question[]>(topic ? `/questions?topic=${encodeURIComponent(topic)}` : "/questions"),
  progress: () => get<TopicProgress[]>("/progress"),
  async answer(id: string, answer: Answer): Promise<AnswerResult> {
    const res = await fetch(`/api/questions/${encodeURIComponent(id)}/answer`, {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answer }),
    });
    if (!res.ok) throw new Error(`cevap gönderilemedi: ${res.status}`);
    return res.json() as Promise<AnswerResult>;
  },
};

export const REPO_URL = "https://github.com/selcukdinc/fpga-pratik";
