import { MtgCard } from "../api/card/card";
import { SCRYFALL } from "../Loader/chyzMtg";

export class CardCache {
    cardCacheByID = new Map<string, MtgCard>();
    cardCacheByName = new Map<string, MtgCard>();

    async getCardFromId(id: string): Promise<MtgCard | undefined> {
        if (this.cardCacheByID.has(id)) {
            return Promise.resolve(this.cardCacheByID.get(id)!);
        } else {
            const card = fetch(SCRYFALL + "cards/" + id).then(response => response.json())
            if (card !== undefined) {
                this.cardCacheByID.set(id, card);
                this.cardCacheByName.set(card.name, card);
            }
            return card;
        }
    }

    async getCardFromName(name: string): Promise<ScryfallCard | undefined> {
        if (this.cardCacheByName.has(name)) {
            return Promise.resolve(this.cardCacheByName.get(name)!);
        } else {
            return Cards.byName(name).then(card => {
                if (card !== undefined) {
                    this.cardCacheByID.set(card.id, card);
                    this.cardCacheByName.set(name, card);
                }
                return card;
            });
        }
    }

    async getCardFromUrl(url: URL) {
        return this.getCardFromId(url.pathname.slice(url.pathname.lastIndexOf("/") + 1, url.pathname.lastIndexOf(".")))
    }
}


// let url = new URL("https://cards.scryfall.io/large/front/6/d/6dc390da-75f8-490a-a724-c12d21cfe578.jpg?1701636845")
// console.log()
// Cards.byName("Zaxara, the Exemplary").then(console.log)
