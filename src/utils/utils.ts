import { Card } from "./types";

const BASE_URL = "https://api.scryfall.com";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const cardCacheByID = new Map<string, Card>();
const cardCacheByName = new Map<string, Card>();

const getCardById = async (id: string): Promise<Card> => {
    console.log(cardCacheByID.has(id));
    if (cardCacheByID.has(id)) { 
        return cardCacheByID.get(id)!;
    } else {
        return fetch(`${BASE_URL}/cards/${id}`)
            .then(response => response.json())
            .then(data => {
                cardCacheByID.set(id, data);
                return data;
            })
            .catch((error) => {
                console.error('Scryfall exploded: ', error);
            });
    }
}
const getCardByName = (name: string) => {
    console.log(cardCacheByName.has(name));
    if (cardCacheByName.has(name)) { 
        return cardCacheByName.get(name)!;
    } else {
        return fetch(`${BASE_URL}/cards/search?q=${encodeURI(name)}`)
            .then(response => response.json())
            .then(data => {
                cardCacheByName.set(name, data);
                return data;
            })
            .catch((error) => {
                console.error('Scryfall exploded: ', error);
            });
    }
}

export {
    getCardById, getCardByName, sleep
};

