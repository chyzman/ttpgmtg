import {Border, Button, globalEvents, HorizontalAlignment, LayoutBox, MultilineTextBox, Player, ScreenUIElement, Text, TextBox, TextJustification, VerticalAlignment, VerticalBox, Widget, world} from "@tabletop-playground/api";
import {IWindowWidget, PlayerWindow, Window, WindowParams, WindowWidgetParams} from "ttpg-darrell";
import {CardCache} from "../utils/card_cache";

export const ID = "CHYZMTG"
export const SCRYFALL = "https://api.scryfall.com/";

export const id = (value: string) => ID + ":" + value

let mtgLoaded = false;

export const CARD_CACHE = new CardCache()

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

const DECK_LOADER_ACTION = id("deck_loader");

const loadCustomActions = () => {
    world.addCustomAction(`[${ID}] Deck Loader`, `Open the ${ID} Deck Loader`, DECK_LOADER_ACTION);

    globalEvents.onCustomAction.add((player, id) => {
        switch (id) {
            case DECK_LOADER_ACTION: {
                displayDeckLoader(player)
                break;
            }
        }
    });
};

const displayDeckLoader = (player: Player) => {
    class DeckLoaderWidget implements IWindowWidget {
        create(params: WindowWidgetParams): Widget {
            return new VerticalBox()
                .addChild(new Text().setText("Idk here").setJustification(TextJustification.Center))
                .addChild(new MultilineTextBox().setMaxLength(2000), 1)
                .addChild(new LayoutBox().setChild(new Button().setText("Confirm").setJustification(TextJustification.Center)).setVerticalAlignment(VerticalAlignment.Bottom).setPadding(0,0,3,0))
                .setVerticalAlignment(VerticalAlignment.Fill);
        }

        destroy(): void {
        }
    }

    const params: WindowParams = {
        disableCollapse: true,
        disableWarpScreenWorld: false,
        title: `${ID} Deck Loader`,
        size: {
            width: 750,
            height: 500,
        },
        screen: {
            anchor: {
                u: 0.5,
                v: 0.5,
            },
            pos: {
                u: 0.5,
                v: 0.5,
            },
        },
        windowWidgetGenerator: (): IWindowWidget => {
            return new DeckLoaderWidget();
        }
    };


    const window = new Window(params, [player.getSlot()]);
    window.attach();


    //
    // const screenUi = new ScreenUIElement()
    //
    // screenUi.anchorX = 0.5
    // screenUi.anchorY = 0.5
    //
    // screenUi.relativePositionX = true
    // screenUi.relativePositionY = true
    //
    // screenUi.positionX = 0.5
    // screenUi.positionY = 0.5
    //
    // screenUi.width = 200
    // screenUi.height = 1000
    //
    //
    // let closeButton;
    // screenUi.widget = new Border().setChild(
    //     new VerticalBox()
    //         .addChild(new Text().setText("idk what to put there").setJustification(1))
    //         .addChild(new TextBox())
    //         .addChild(closeButton = new Button().setText("Close").setJustification(1))
    //         .addChild(new MultilineTextBox().setMaxLength(Number.MAX_VALUE))
    // )
    //
    // closeButton.onClicked.add((_, __) => {
    //     world.removeScreenUIElement(screenUi);
    // })
    //
    // screenUi.players.addPlayer(player)
    // world.addScreenUI(screenUi);
}
