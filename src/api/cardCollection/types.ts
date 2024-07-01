import { MtgCard } from "../card/types";
import { MtgCardIdentifier } from "../cardIdentifier/types";

export type MtgCardCollection = {
  data: MtgCard[];
  not_found: MtgCardIdentifier[];
}
