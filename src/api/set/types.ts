export interface MtgSet {
  arena_code?: string;
  block: string;
  block_code: string;
  card_count: number;
  code: string;
  digital: boolean;
  foil_only: boolean;
  icon_svg_uri: string;
  id: string;
  mtgo_code?: string;
  name: string;
  nonfoil_only: boolean;
  parent_set_code?: string;
  released_at: Date;
  scryfall_uri: URL;
  search_uri: URL;
  set_type: MtgSetType;
  tcgplayer_id?: number;
  uri: URL;
}

export type MtgSetType =
  | 'alchemy'
  | 'archenemy'
  | 'arsenal'
  | 'box'
  | 'commander'
  | 'core'
  | 'draft_innovation'
  | 'duel_deck'
  | 'expansion'
  | 'from_the_vault'
  | 'funny'
  | 'masterpiece'
  | 'masters'
  | 'memorabilia'
  | 'minigame'
  | 'planechase'
  | 'premium_deck'
  | 'promo'
  | 'spellbook'
  | 'starter'
  | 'token'
  | 'treasure_chest'
  | 'vanguard';
