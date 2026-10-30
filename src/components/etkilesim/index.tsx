// Etkileşimli ders şekilleri: Gorsel.etkilesim alanındaki adla seçilir
import type { ComponentType } from "react";
import type { Gorsel } from "../../gorseller/tip";
import { Delta } from "./Delta";
import { Durum } from "./Durum";
import { Kenar } from "./Kenar";
import { Lut } from "./Lut";
import { Maliyet } from "./Maliyet";
import { Oznitelik } from "./Oznitelik";
import { Ucgen } from "./Ucgen";

export const ETKILESIMLER: Record<string, ComponentType<{ g: Gorsel }>> = {
  maliyet: Maliyet,
  lut: Lut,
  oznitelik: Oznitelik,
  delta: Delta,
  durum: Durum,
  kenar: Kenar,
  ucgen: Ucgen,
};
