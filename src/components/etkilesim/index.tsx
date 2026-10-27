// Etkileşimli ders şekilleri: Gorsel.etkilesim alanındaki adla seçilir
import type { ComponentType } from "react";
import type { Gorsel } from "../../gorseller/tip";
import { Delta } from "./Delta";
import { Durum } from "./Durum";
import { Lut } from "./Lut";
import { Maliyet } from "./Maliyet";
import { Oznitelik } from "./Oznitelik";

export const ETKILESIMLER: Record<string, ComponentType<{ g: Gorsel }>> = {
  maliyet: Maliyet,
  lut: Lut,
  oznitelik: Oznitelik,
  delta: Delta,
  durum: Durum,
};
