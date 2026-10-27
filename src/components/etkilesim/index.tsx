// Etkileşimli ders şekilleri: Gorsel.etkilesim alanındaki adla seçilir
import type { ComponentType } from "react";
import type { Gorsel } from "../../gorseller/tip";
import { Maliyet } from "./Maliyet";

export const ETKILESIMLER: Record<string, ComponentType<{ g: Gorsel }>> = {
  maliyet: Maliyet,
};
