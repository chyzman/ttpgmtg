import {globalEvents, world} from "@tabletop-playground/api";
import {spawnDeck} from "../contextMenu/spawn_deck";

let mtgLoaded = false;

const ID = "CHYZMTG"

export const id = (value: string) => ID + ":" + value

export const loadMtg = (complainIfAlreadyLoaded: boolean = false) => {
    if (mtgLoaded) {
        if (complainIfAlreadyLoaded) {
            console.log(`${ID} is already loaded`);
        }
        return false;
    }
    loadCustomActions();

    mtgLoaded = true;
    world.getAllPlayers().forEach(player => player.showMessage(`${ID} is now loaded`));
    return true;
};

const SPAWN_DECK_ACTION = id("spawn_deck");

const loadCustomActions = () => {
    world.addCustomAction(`[${ID}] Spawn Deck`, "Open the Deck importer UI", SPAWN_DECK_ACTION);

    globalEvents.onCustomAction.add((player, id) => {
        player.showMessage(`FUCK YOU!!!!! (${id})`)
        console.log(id)
        switch (id) {
            case SPAWN_DECK_ACTION: {
                console.log("boobs (spawn_deck)");
                spawnDeck(player);
                break;
            }
        }
    });
};
