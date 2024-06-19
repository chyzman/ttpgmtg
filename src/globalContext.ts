import { globalEvents, world } from "@tabletop-playground/api";
import { spawnDeck } from "./contextMenu/spawn_deck";

const hasBeenCalled = false;

export const createGlobalContextOptions = () => {
    console.log(`hasBeenCalled: ${hasBeenCalled}`)
    if (!hasBeenCalled) {
        world.addCustomAction(" >> Spawn Deck << ", "Show the Ui Element to pick a deck to spawn", "spawn_deck");
    
        for (let player of world.getAllPlayers()) {
            player.showMessage("FUCK YOU!!!!! (game loadered :3)")
        }

        globalEvents.onCustomAction.add((player, iden) => {
            player.showMessage(`FUCK YOU!!!!! (${iden})`)
            console.log(iden)
            switch (iden) {
                case "spawn_deck": {
                    console.log("boobs (spawn_deck)");
                    spawnDeck(player);
                    break;
                };
            };
        }); 
    } else {
        return;
    }
};