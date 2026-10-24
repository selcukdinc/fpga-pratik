// Hash tabanlı küçük yönlendirici: #/pratik, #/sorular/<konu>, #/ilerleme, #/hakkinda

import { useEffect, useState } from "react";

export type Route =
  | { page: "pratik" }
  | { page: "sorular"; topic?: string }
  | { page: "ilerleme" }
  | { page: "hakkinda" };

export function parseHash(hash: string): Route {
  const [page, arg] = hash.replace(/^#\/?/, "").split("/");
  switch (page) {
    case "sorular":
      return { page: "sorular", topic: arg ? decodeURIComponent(arg) : undefined };
    case "ilerleme":
      return { page: "ilerleme" };
    case "hakkinda":
      return { page: "hakkinda" };
    default:
      return { page: "pratik" };
  }
}

export function href(route: Route): string {
  if (route.page === "sorular" && route.topic) return `#/sorular/${encodeURIComponent(route.topic)}`;
  return `#/${route.page}`;
}

export function useRoute(): Route {
  const [route, setRoute] = useState(() => parseHash(location.hash));
  useEffect(() => {
    const onChange = () => setRoute(parseHash(location.hash));
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  return route;
}
