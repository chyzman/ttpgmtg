export interface MtgManaCost {
  cmc: number;
  colorless: boolean;
  colors: MtgColor[];
  cost: string;
  monocolored: boolean;
  multicolored: boolean;
}

export interface MtgSymbology {
  appears_in_mana_costs: boolean;
  colors: MtgColor[];
  english: string;
  funny: boolean;
  gatherer_alternates?: string[];
  hybrid: boolean;
  loose_variant?: string;
  mana_value?: number;
  phrexian: boolean;
  represents_mana: boolean;
  svg_uri?: URL;
  symbol: string;
  transposable: boolean;
}

export type MtgColor = "B" | "G" | "R" | "U" | "W";
