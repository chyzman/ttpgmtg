import { fetch } from "@tabletop-playground/api";
import { SCRYFALL } from "../api/api";
import { MtgCard } from "../api/card/types";
import { cardFromJson } from "../api/card/api";
import {  MtgRulings } from "../api/ruling/types";
import { rulingsFromJson } from "../api/ruling/api";

const re = /(http[s]?:\/\/)?([^\/\s]+\/)([^?]*)[?]*(.*)/

export class CardCache {
  cardCacheByID = new Map<string, MtgCard>();
  cardCacheByName = new Map<string, MtgCard>();

  rulingsCacheByID = new Map<string, MtgRulings>();

  async getCardFromId(id: string) {
    if (this.cardCacheByID.has(id)) {
      return this.cardCacheByID.get(id);
    } else {
      const response = await fetch(SCRYFALL + "cards/" + id)
      if (!response.ok) console.error("Failed to fetch card with id " + id);
      const card = cardFromJson(response.text());
      if (card !== undefined) {
        this.cardCacheByID.set(id, card);
        this.cardCacheByName.set(card.name, card);
      }
      return card;
    }
  }

  // async getCardFromName(name: string): Promise<ScryfallCard | undefined> {
  //     if (this.cardCacheByName.has(name)) {
  //         return Promise.resolve(this.cardCacheByName.get(name)!);
  //     } else {
  //         return Cards.byName(name).then(card => {
  //             if (card !== undefined) {
  //                 this.cardCacheByID.set(card.id, card);
  //                 this.cardCacheByName.set(name, card);
  //             }
  //             return card;
  //         });
  //     }
  // }

  async getCardFromUrl(urlString: string) {
    let pathname = urlString.match(re)![3];
    return this.getCardFromId(pathname.slice(pathname.lastIndexOf("/") + 1, pathname.lastIndexOf(".")));
  }

  async getRulingsFromCard(card: MtgCard) {
    if (this.rulingsCacheByID.has(card.id)) {
      return this.rulingsCacheByID.get(card.id);
    } else {
      const response = await fetch(card.rulings_uri);
      if (!response.ok) console.error("Failed to fetch rulings for card " + card.name);
      const rulings = rulingsFromJson(response.text());
      if (rulings !== undefined) {
        this.rulingsCacheByID.set(card.id, rulings);
      }
      return rulings;
    }
  }
}
