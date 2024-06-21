import {Cards, Card} from 'scryfall-api';

class CardCache {
    cardCacheByID = new Map<string, Card>();
    cardCacheByName = new Map<string, Card>();

    getCardFromId(id: string): Promise<Card | undefined> {
        if (this.cardCacheByID.has(id)) {
            return Promise.resolve(this.cardCacheByID.get(id)!);
        } else {
            return Cards.byId(id).then(card => {
                if (card !== undefined) {
                    this.cardCacheByID.set(id, card);
                    this.cardCacheByName.set(card.name, card);
                }
                return card;
            });
        }
    }
}

Cards.byName("Zaxara, the Exemplary").then(console.log)
