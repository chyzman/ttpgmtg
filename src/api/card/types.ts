import { MtgColor } from "../symbology/types";
import { MtgSetType } from "../set/types";


export type MtgCard = MtgCardBase & MtgCardGameplay & MtgCardPrint;


export interface MtgCardBase {
  arena_id?: number;
  cardmarket_id?: number;
  id: string;
  lang: MtgCardLanguage;
  layout: MtgCardLayout;
  mtgo_foil_id?: number;
  mtgo_id?: number;
  multiverse_ids?: number[];
  oracle_id?: string;
  prints_search_uri: URL;
  rulings_uri: URL;
  scryfall_uri: URL;
  tcgplayer_etched_id?: number;
  tcgplayer_id?: number;
  uri: URL;
}

export interface MtgCardGameplay {
  all_parts?: MtgRelatedCard[];
  card_faces?: MtgCardFace[];
  cmc: number;
  color_identity: MtgColor[];
  color_indicator?: MtgColor[];
  colors?: MtgColor[];
  defense?: string;
  edhrec_rank?: number;
  hand_modifier?: string;
  keywords: string[];
  legalities: MtgCardLegalities;
  life_modifier?: string;
  loyalty?: string;
  mana_cost?: string;
  name: string;
  oracle_text?: string;
  penny_rank?: number;
  power?: string;
  produced_mana?: MtgColor[];
  reserved: boolean;
  toughness?: string;
  type_line: string;
}

export interface MtgCardPrint {
  artist?: string;
  artist_ids?: string[];
  attribution_lights?: number[];
  booster: boolean;
  border_color: string;
  card_back_id: string;
  collector_number: string;
  content_warning?: boolean;
  digital: boolean;
  finishes: MtgCardFinish;
  flavor_name?: string;
  flavor_text?: string;
  frame: MtgCardFrame;
  frame_effects: MtgCardFrameEffect[];
  full_art: boolean;
  games: MtgCardGames[];
  highres_image: boolean;
  illustration_id?: string;
  image_status: MtgCardImageStatus;
  image_uris: MtgCardImageUris;
  oversized: boolean;
  preview: MtgCardPeview;
  prices: MtgCardPrices;
  printed_name?: string;
  printed_text?: string;
  printed_type_line?: string;
  promo: boolean;
  promo_types?: MtgCardPromoType[];
  purchase_uris: MtgCardPurchaseUris;
  rarity: MtgCardRarity;
  related_uris: MtgCardRelatedUris;
  released_at: Date;
  reprint: boolean;
  scryfall_set_uri: URL;
  security_stamp?: MtgCardSecurityStamp;
  set: string;
  set_name: string;
  set_search_uri: URL;
  set_type: MtgSetType;
  set_uri: URL;
  story_spotlight: boolean;
  textless: boolean;
  variation: boolean;
  variation_of?: string;
  watermark?: string;
}

export interface MtgCardFace {
  artist?: string;
  artist_id?: string;
  cmc?: number;
  color_indicator?: MtgColor[];
  colors?: MtgColor[];
  defense?: string;
  flavor_text?: string;
  illustration_id?: string;
  image_uris?: MtgCardImageUris;
  layout?: string;
  loyalty?: string;
  mana_cost: string;
  name: string;
  oracle_id?: string;
  oracle_text?: string;
  power?: string;
  printed_name?: string;
  printed_text?: string;
  printed_type_line?: string;
  toughness?: string;
  type_line?: string;
  watermark?: string;
}

export interface MtgCardImageUris {
  png: URL;
  border_crop: URL;
  art_crop: URL;
  large: URL;
  normal: URL;
  small: URL;
}

export interface MtgCardLegalities {
  standard: MtgCardLegality;
  future: MtgCardLegality;
  historic: MtgCardLegality;
  timeless: MtgCardLegality;
  gladiator: MtgCardLegality;
  pioneer: MtgCardLegality;
  explorer: MtgCardLegality;
  modern: MtgCardLegality;
  legacy: MtgCardLegality;
  pauper: MtgCardLegality;
  vintage: MtgCardLegality;
  penny: MtgCardLegality;
  commander: MtgCardLegality;
  oathbreaker: MtgCardLegality;
  standardbrawl: MtgCardLegality;
  brawl: MtgCardLegality;
  alchemy: MtgCardLegality;
  paupercommander: MtgCardLegality;
  duel: MtgCardLegality;
  oldschool: MtgCardLegality;
  premodern: MtgCardLegality;
  predh: MtgCardLegality;
}

export interface MtgCardPeview {
  source: string;
  source_uri: URL;
  previewed_at: Date;
}

export interface MtgCardPrices {
  usd?: string;
  usd_foil?: string;
  usd_etched?: string;
  eur?: string;
  eur_foil?: string;
  euro_etched?: string;
  tix?: string;
}

export interface MtgCardPurchaseUris {
  [key: string]: string | undefined;

  cardhoarder?: string;
  cardmarket?: string;
  tcgplayer?: string;
}

export interface MtgRelatedCard {
  component: MtgCardComponent;
  id: string;
  name: string;
  type_line: string;
  uri: URL;
}

export interface MtgCardRelatedUris {
  [key: string]: string | undefined;

  edhrec?: string;
  gatherer?: string;
  mtgtop8?: string;
  tcgplayer_decks?: string;
  tcgplayer_infinite_articles?: string;
  tcgplayer_infinite_decks?: string;
}

export type MtgCardBorderColor =
  | "black"
  | "borderless"
  | "gold"
  | "silver"
  | "white";

export type MtgCardComponent =
  | "combo_piece"
  | "meld_part"
  | "meld_result"
  | "token";

export type MtgCardFinish =
  | "foil"
  | "nonfoil"
  | "etched";

export type MtgCardFrame =
  | "1993"
  | "1997"
  | "2003"
  | "2015"
  | "future";

export type MtgCardFrameEffect =
  | "colorshifted"
  | "companion"
  | "compasslanddfc"
  | "convertdfc"
  | "devoid"
  | "draft"
  | "etched"
  | "extendedart"
  | "fandfc"
  | "inverted"
  | "legendary"
  | "lesson"
  | "miracle"
  | "mooneldrazidfc"
  | "nyxtouched"
  | "originpwdfc"
  | "shatteredglass"
  | "showcase"
  | "snow"
  | "spree"
  | "sunmoondfc"
  | "tombstone"
  | "upsidedowndfc"
  | "waxingandwaningmoondfc";

export type MtgCardGames =
  | "arena"
  | "mtgo"
  | "paper";

export type MtgCardImageStatus =
  | "highres_scan"
  | "lowres"
  | "missing"
  | "placeholder";

export type MtgCardLayout =
  | "adventure"
  | "art_series"
  | "augment"
  | "battle"
  | "case"
  | "class"
  | "double_faced_token"
  | "emblem"
  | "flip"
  | "host"
  | "leveler"
  | "meld"
  | "modal_dfc"
  | "mutate"
  | "normal"
  | "planar"
  | "prototype"
  | "reversible_card"
  | "saga"
  | "scheme"
  | "split"
  | "token"
  | "transform"
  | "vanguard";

export type MtgCardLanguage =
  | "ar"
  | "de"
  | "en"
  | "es"
  | "fr"
  | "grc"
  | "he"
  | "it"
  | "ja"
  | "ko"
  | "la"
  | "ph"
  | "pt"
  | "ru"
  | "sa"
  | "zhs"
  | "zht";

export type MtgCardLegality =
  | "banned"
  | "legal"
  | "not_legal"
  | "restricted";

export type MtgCardPromoType =
  | "arenaleague"
  | "buyabox"
  | "convention"
  | "datestamped"
  | "draftweekend"
  | "duels"
  | "event"
  | "fnm"
  | "gameday"
  | "gateway"
  | "giftbox"
  | "instore"
  | "intropack"
  | "judgegift"
  | "league"
  | "openhouse"
  | "ourney"
  | "planeswalkerdeck"
  | "playerrewards"
  | "premiereshop"
  | "prerelease"
  | "release"
  | "setpromo"
  | "starterdeck"
  | "wizardsplaynetwork";

export type MtgCardRarity =
  | "common"
  | "uncommon"
  | "rare"
  | "mythic"
  | "special"
  | "bonus";

export type MtgCardSecurityStamp =
  | "acorn"
  | "arena"
  | "circle"
  | "heart"
  | "oval"
  | "triangle";
