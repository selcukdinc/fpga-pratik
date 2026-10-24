import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { href } from "../lib/router";
import type { TopicProgress } from "../../shared/api";

export function Progress() {
  const [rows, setRows] = useState<TopicProgress[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.progress().then(setRows, (e) => setError(String(e)));
  }, []);

  if (error) return <p className="empty">İlerleme yüklenemedi: {error}</p>;
  if (!rows) return <p className="empty">Yükleniyor…</p>;

  return (
    <div className="progress">
      <p className="hint">Her konuda en az bir kez doğru çözdüğün soruların oranı. Eksik olduğun konular üstte.</p>
      <table>
        <thead>
          <tr>
            <th>Hafta</th>
            <th>Konu</th>
            <th>Doğru</th>
            <th>Durum</th>
          </tr>
        </thead>
        <tbody>
          {[...rows]
            .sort((a, b) => a.correct / (a.total || 1) - b.correct / (b.total || 1))
            .map((r) => {
              const pct = r.total ? Math.round((r.correct / r.total) * 100) : 0;
              return (
                <tr key={r.topicId}>
                  <td>{r.week}</td>
                  <td>
                    <a href={href({ page: "sorular", topic: r.topicId })}>{r.title}</a>
                  </td>
                  <td>
                    {r.correct} / {r.total}
                  </td>
                  <td>
                    <div className="bar" role="img" aria-label={`%${pct}`}>
                      <div style={{ width: `${pct}%` }} />
                    </div>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}
