import type { SimMessage } from "../sim/messages";

const LABEL: Record<SimMessage["severity"], string> = {
  error: "Hata",
  fatal: "Hata",
  failure: "Hata",
  warning: "Uyarı",
  note: "Bilgi",
};

interface Props {
  messages: SimMessage[];
  onSelect: (m: SimMessage) => void;
}

export function MessagesPanel({ messages, onSelect }: Props) {
  if (messages.length === 0) return <p className="empty">Mesaj yok.</p>;
  return (
    <ul className="messages">
      {messages.map((m, i) => (
        <li key={i} className={`msg msg-${m.severity}`}>
          <button onClick={() => onSelect(m)} disabled={!m.file}>
            <span className="msg-sev">{LABEL[m.severity]}</span>
            <span className="msg-text">{m.text}</span>
            {m.file && (
              <span className="msg-loc">
                {m.file}:{m.line}
              </span>
            )}
          </button>
          {m.detail.length > 0 && <pre className="msg-detail">{m.detail.join("\n")}</pre>}
        </li>
      ))}
    </ul>
  );
}
