import {Border, Button, globalEvents, MultilineTextBox, Player, ScreenUIElement, Text, TextBox, VerticalBox, world} from "@tabletop-playground/api";
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
        switch (id) {
            case SPAWN_DECK_ACTION: {
                displayDeckLoader(player)
                break;
            }
        }
    });
};

const displayDeckLoader = (player: Player) => {
    const screenUi = new ScreenUIElement()

    screenUi.anchorX = 0.5
    screenUi.anchorY = 0.5

    screenUi.relativePositionX = true
    screenUi.relativePositionY = true

    screenUi.positionX = 0.5
    screenUi.positionY = 0.5

    screenUi.width = 200
    screenUi.height = 1000


    let closeButton;
    screenUi.widget = new Border().setChild(
        new VerticalBox()
            .addChild(new Text().setText("idk what to put there").setJustification(1))
            .addChild(new TextBox())
            .addChild(closeButton = new Button().setText("Close").setJustification(1))
            .addChild(new MultilineTextBox().setMaxLength(Number.MAX_VALUE))
    )

    closeButton.onClicked.add((_, __) => {
        world.removeScreenUIElement(screenUi);
    })

    screenUi.players.addPlayer(player)
    world.addScreenUI(screenUi);
}
