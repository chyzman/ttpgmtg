import { MtgRuling, MtgRulings } from "./types";

export function rulingsFromJson(jsonString: string): MtgRulings {
  return JSON.parse(jsonString) as MtgRulings;
}
