import {
    world,
    fetch
} from "@tabletop-playground/api";

const SCRYFALL = "https://api.scryfall.com/";

const idToCardCache: { [id: string]: object } = {};
const nameToCardCache: { [name: string]: object } = {};

function cardFromId(id: string) {
    let result = idToCardCache[id];
    if (result === undefined) {
        fetch(SCRYFALL + "cards/" + id)
            .then(response => {
                idToCardCache[id] = data;
                nameToCardCache[data] = data;
            })
            .catch((error) => {
                console.error('Scryfall exploded: ', error);
            });

    } else {
        return result;
    }
}
