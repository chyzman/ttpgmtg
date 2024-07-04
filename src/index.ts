import { Player } from "@tabletop-playground/api";
import { CardUtil, Window } from "ttpg-darrell";
import { ChyzMtgWindowData } from "./ui/chyzMtgWindow";
import { CardCache } from "./utils/card_cache";

export const ID = "CHYZMTG";
export const CARD_TEMPLATE = "1B4898A44113ED6C0736F6985D74A079";

export const CARD_CACHE = new CardCache();
export const CARD_UTIL = new CardUtil();

export const currentWindows = new Map<Player, Window>();
export const windowData = new Map<Player, ChyzMtgWindowData>();

export const id = (value: string) => ID + ":" + value;
