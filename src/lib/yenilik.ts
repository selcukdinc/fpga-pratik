// Yenilikler sayfasında en son hangi kaydın görüldüğü. Yalnızca bu tarayıcıda
// saklanır; sunucuya gitmez. Menüdeki rozet görülmemiş kayıtları sayar.

import { useSyncExternalStore } from "react";
import { YENILIKLER } from "../yenilikler";

const ANAHTAR = "fpga-pratik:yenilik-goruldu";
// Bu sayfa gelmeden önce siteyi kullananlara son günün değişiklikleri yeni görünür
const ILK_TABAN = 20;
export const SON_YENILIK = YENILIKLER[0]?.pr ?? 0;

function oku(): number {
  try {
    const v = localStorage.getItem(ANAHTAR);
    if (v !== null) return Number(v) || 0;
    // İlk kez gelen biri için her şey yenidir; rozetle karşılanmasın
    const taban = localStorage.getItem("fpga-pratik:tanitim-goruldu") === "1" ? ILK_TABAN : SON_YENILIK;
    localStorage.setItem(ANAHTAR, String(taban));
    return taban;
  } catch {
    return SON_YENILIK;
  }
}

let goruldu: number | null = null;
const dinleyenler = new Set<() => void>();
const abone = (f: () => void) => {
  dinleyenler.add(f);
  return () => dinleyenler.delete(f);
};
const anlik = () => (goruldu ??= oku());

export function useSonGorulen(): number {
  return useSyncExternalStore(abone, anlik);
}

export const gorulmemisSayisi = (son: number) => YENILIKLER.filter((y) => y.pr > son).length;

export function hepsiGoruldu() {
  if (anlik() >= SON_YENILIK) return;
  goruldu = SON_YENILIK;
  try {
    localStorage.setItem(ANAHTAR, String(SON_YENILIK));
  } catch {
    // depolama kapalı
  }
  dinleyenler.forEach((f) => f());
}
