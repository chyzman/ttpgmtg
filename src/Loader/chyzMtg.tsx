import { Card, globalEvents, MultilineTextBox, Player, TextJustification, Vector, VerticalAlignment, Widget, world } from "@tabletop-playground/api";
import { CardUtil, IWindowWidget, Window, WindowParams, WindowWidgetParams } from "ttpg-darrell";
import { CardCache } from "../utils/card_cache";
import { boxChild, jsxInTTPG, render, useRef } from "jsx-in-ttpg";
import { Tabs } from "ttpg-trh-ui";
import { MtgCard, SCRYFALL } from "../api";
import { parseDeckList } from "../utils/deck_parser";


export const ID = "CHYZMTG";

export const CARD_TEMPLATE = "1B4898A44113ED6C0736F6985D74A079";

export const id = (value: string) => ID + ":" + value;

let mtgLoaded = false;

export const CARD_CACHE = new CardCache();

export const CARD_UTIL = new CardUtil();

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

  const queueResolver = setInterval(() => {
    CARD_CACHE.resolveQueue();
  }, 1000);

  return true;
};

const OPEN_MENU_ACTION = id("open_menu");

const loadCustomActions = () => {
  world.addCustomAction(`${ID}`, `open ${ID} Menu`, OPEN_MENU_ACTION);

  globalEvents.onCustomAction.add((player, id) => {
    switch (id) {
      case OPEN_MENU_ACTION: {
        displayDeckLoader(player);
        break;
      }
    }
  });
};

const displayDeckLoader = (player: Player) => {
  const deckInput = new MultilineTextBox().setMaxLength(2000);

  class DeckLoaderWidget implements IWindowWidget {
    create(params: WindowWidgetParams): Widget {
      return render(
        <Tabs titles={["Deck", "Card"]}>
          <verticalbox valign={VerticalAlignment.Fill}>
            <text justify={TextJustification.Center}>Paste Deck List/Url Here</text>
            {boxChild(1, deckInput)}
            <button onClick={(button, player) => {
              if (deckInput === undefined || deckInput?.getText() === undefined) return;
              let parsed = parseDeckList(deckInput.getText());
              if (parsed === undefined) {
                player.showMessage("Invalid Deck List");
                return;
              }
              let deckObject: Card;
              parsed.forEach(value => {
                CARD_CACHE.getCardFromNameSet(value.name, value.set).then(card => {
                  if (card !== undefined) {
                    for (let i = 0; i < value.count; i++) {
                      let cardObject = world.createObjectFromTemplate(CARD_TEMPLATE, [0, 0, 100]) as Card;
                      cardObject.setTextureOverrideURL(card.image_uris.png);
                      cardObject.flipOrUpright();
                      if (deckObject === undefined) {
                        deckObject = cardObject;
                      } else {
                        deckObject.addCards(cardObject);
                      }
                    }
                  }
                });
              });
            }}>Load Deck
            </button>
          </verticalbox>
          <verticalbox valign={VerticalAlignment.Fill}>
            <text justify={TextJustification.Center}>IDK how im gonna format this yet</text>
            {boxChild(1, <textarea maxLength={2000}></textarea>)}
            <button>Load Card</button>
            <button onClick={async (button, player) => {
              await fetch(SCRYFALL + "cards/random").then(value => value.json()).then(mtgCard => {
                const card = mtgCard as MtgCard;
                if (card !== undefined) {
                  let pos = player.getCursorPosition();
                  const table = world.getAllTables()[0];
                  if (table !== undefined) {
                    pos = new Vector(
                      randomIntFromInterval((-table.getSize().x + 4) / 2, (table.getSize().x - 4) / 2),
                      randomIntFromInterval((-table.getSize().y + 5) / 2, (table.getSize().y - 5) / 2),
                      100
                    );
                  }
                  const cardObject = world.createObjectFromTemplate(CARD_TEMPLATE, pos);
                  if (cardObject) {
                    CARD_CACHE.addToCaches(card);
                    (cardObject as Card).setTextureOverrideURL(card.image_uris.png);
                    cardObject.flipOrUpright();
                  }
                }
              });
            }}>Random
            </button>
          </verticalbox>
        </Tabs>
      );

      // return new VerticalBox()
      //   .addChild(new Text().setText("Idk here").setJustification(TextJustification.Center))
      //   .addChild(new MultilineTextBox().setMaxLength(2000), 1)
      //   .addChild(new LayoutBox().setChild(new Button().setText("Confirm").setJustification(TextJustification.Center)).setVerticalAlignment(VerticalAlignment.Bottom).setPadding(0, 0, 3, 0))
      //   .setVerticalAlignment(VerticalAlignment.Fill);
    }

    destroy(): void {
    }
  }

  const params: WindowParams = {
    disableCollapse: true,
    disableWarpScreenWorld: false,
    title: `${ID}`,
    size: {
      width: 750,
      height: 500
    },
    screen: {
      anchor: {
        u: 0,
        v: 0.5
      },
      pos: {
        u: 0,
        v: 0.5
      }
    },
    windowWidgetGenerator: (): IWindowWidget => {
      return new DeckLoaderWidget();
    }
  };


  const window = new Window(params, [player.getSlot()]);
  window.attach();


  function randomIntFromInterval(min: number, max: number) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
};
