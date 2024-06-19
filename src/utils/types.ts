
export type Card = {
    object: string;
    id: string;
    oracle_id: string;
    multiverse_ids: string[];
    mtgo_id: string;
    tcgplayer_id: string;
    name: string;
    lang: string;
    released_at: string;
    uri: string;
    scryfall_uri: string;
    layout: string;
    highres_image: boolean;
    image_status: string;
    image_uris: Record<string, string>;
    mana_cost: string;
    cmc: number;
    type_line: string;
    oracle_text: string;
    power: string;
    toughness: string;
    colors: string[];
    color_identity: string[];
    keywords: string[];
    produced_mana: string[];
    all_parts: relatedCards[];
    legalities: Record<string, string>;
    games: string[];
    reserved: boolean;
    foil: boolean;
    nonfoil: boolean;
    oversized: boolean;
    promo: boolean;
    reprint: boolean;
    variation: boolean;
    set_id: string;
    set: string;
    set_name: string;
    set_type: string;
    set_uri: string;
    set_search_uri: string;
    scryfall_set_uri: string;
    rulings_uri: string;
    prints_search_uri: string;
    collector_number: string
    digital: boolean;
    rarity: string;
    card_back_id: string;
    artist: string;
    artist_ids: string[];
    illustration_id: string;
    border_color: string;
    frame: string;
    frame_effects: string[];
    security_stamp: string;
    full_art: boolean;
    textless: boolean;
    booster: boolean;
    story_spotlight: boolean;
    edhrec_rank: number;
    prices: Record<string, string | null>;
    related_uris: Record<string, string>;
    purchase_uris: Record<string, string>;
  }
  
  export type relatedCards = {
    object: string;
    id: string;
    component: string;
    name: string;
    type_line: string;
    uri: string;
  }