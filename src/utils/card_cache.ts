import { fetch } from "@tabletop-playground/api";
import { SCRYFALL, MtgCard, MtgRulings, MtgCardIdentifier, MtgCardIdentifierId, MtgCardIdentifierNameSet, MtgCardCollection, ScryfallResponseError } from "../api";
import { rulingsFromJson } from "../api/ruling/api";

const re = /(http[s]?:\/\/)?([^\/\s]+\/)([^?]*)[?]*(.*)/;

export class CardCache {
  cardCacheByID = new Map<MtgCardIdentifierId, MtgCard>();
  cardCacheByName = new Map<MtgCardIdentifierNameSet, MtgCard>();

  rulingsCacheByID = new Map<string, MtgRulings>();

  cardQueue: Array<[MtgCardIdentifier, { resolve: (value: MtgCard) => void, reject: (reason?: any) => void }]> = [];


  async resolveQueue() {
    if (this.cardQueue.length == 0) return;
    const targets = this.cardQueue.slice(0, 75);
    const response = await fetch(SCRYFALL + "cards/collection", {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        identifiers: targets.map(([identifier, _]) => (identifier))
      })
    });
    if (!response.ok) console.error(`Failed to fetch cards: "${(response.json() as ScryfallResponseError).details}"`);
    const collection = response.json() as MtgCardCollection;
    let index = 0;
    targets.forEach(([id, { resolve, reject }]) => {
      if (collection.not_found.includes(id)) {
        reject("Card not found");
      } else {
        const card = collection.data[index];
        this.addToCaches(card);
        resolve(card);
        this.cardQueue = this.cardQueue.filter(identifier => identifier[0] !== id);
        index++;
      }
    });
  }

  addToCaches(card: MtgCard) {
    this.cardCacheByID.set({ id: card.id }, card);
    this.cardCacheByName.set({ name: card.name, set: card.set }, card);
  }

  private async getCardFromIdentifier(identifier: MtgCardIdentifier) {
    let promiseResolve: (card: MtgCard) => void = () => {
    };
    let promiseReject: (reason?: any) => void = () => {
    };

    let promise: Promise<MtgCard> = new Promise(function(resolve, reject) {
      promiseResolve = resolve;
      promiseReject = reject;
    });

    this.cardQueue.push([identifier, { resolve: promiseResolve, reject: promiseReject }]);

    return promise;
  }

  async getCardFromId(id: string) {
    const identifier: MtgCardIdentifierId = { id: id };
    if (this.cardCacheByID.has(identifier)) {
      return this.cardCacheByID.get(identifier);
    } else {
      return this.getCardFromIdentifier(identifier);
    }
  }

  async getCardFromUrl(urlString: string) {
    let pathname = urlString.match(re)![3];
    return this.getCardFromId(pathname.slice(pathname.lastIndexOf("/") + 1, pathname.lastIndexOf(".")));
  }

  async getCardFromNameSet(name: string, set?: string) {
    const identifier: MtgCardIdentifierNameSet = { name: name, set: set };
    if (this.cardCacheByName.has(identifier)) {
      return this.cardCacheByName.get(identifier);
    } else {
      return this.getCardFromIdentifier(identifier);
    }
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
