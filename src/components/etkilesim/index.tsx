// Etkileşimli ders şekilleri: Gorsel.etkilesim alanındaki adla seçilir
import type { ComponentType } from "react";
import type { Gorsel } from "../../gorseller/tip";
import { Lut } from "./Lut";
import { Maliyet } from "./Maliyet";
import { Oznitelik } from "./Oznitelik";

export const ETKILESIMLER: Record<string, ComponentType<{ g: Gorsel }>> = {
  maliyet: Maliyet,
  lut: Lut,
  oznitelik: Oznitelik,
};
