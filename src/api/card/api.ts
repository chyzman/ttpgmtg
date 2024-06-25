import { MtgCard } from "./types";

export function cardFromJson(jsonString: string): MtgCard {
  return JSON.parse(jsonString) as MtgCard;
}
