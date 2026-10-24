import { useEffect, useState } from "react";
import { Shell } from "./components/Shell";
import { useRoute } from "./lib/router";
import { api } from "./lib/api";
import { Sandbox } from "./pages/Sandbox";
import { Questions } from "./pages/Questions";
import { Progress } from "./pages/Progress";
import { About } from "./pages/About";
import type { Topic } from "../shared/api";

export function App() {
  const route = useRoute();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [currentWeek, setCurrentWeek] = useState<number | null>(null);
  const [status, setStatus] = useState("Hazır");

  useEffect(() => {
    api.topics().then(
      (r) => {
        setTopics(r.topics);
        setCurrentWeek(r.currentWeek);
      },
      // API yoksa (ör. yalnızca statik önizleme) pratik alanı yine çalışır
      () => setTopics([]),
    );
  }, []);

  const topicTitle = route.page === "sorular" && route.topic ? topics.find((t) => t.id === route.topic)?.title : undefined;
  const title =
    route.page === "pratik" ? "PRATİK - Simülasyon alanı"
    : route.page === "sorular" ? `SORU HAVUZU - ${topicTitle ?? "Tüm sorular"}`
    : route.page === "ilerleme" ? "İLERLEME - Konu bazlı durum"
    : "HAKKINDA";

  useEffect(() => {
    document.title = `${title} · FPGA Pratik`;
  }, [title]);

  return (
    <Shell route={route} topics={topics} currentWeek={currentWeek} title={title} status={status}>
      {route.page === "pratik" && <Sandbox onStatus={setStatus} />}
      {route.page === "sorular" && <Questions topic={route.topic} />}
      {route.page === "ilerleme" && <Progress />}
      {route.page === "hakkinda" && <About />}
    </Shell>
  );
}
