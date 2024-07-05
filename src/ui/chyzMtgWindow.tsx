import { Border, Card, ImageWidget, MultilineTextBox, Player, refPackageId, Text, TextJustification, UIElement, Vector, VerticalAlignment, Widget, world } from "@tabletop-playground/api";
import { IWindowWidget, NamespaceId, Window, WindowParams, WindowWidgetParams } from "ttpg-darrell";
import { boxChild, jsxInTTPG, render } from "jsx-in-ttpg";
import { Tabs } from "ttpg-trh-ui";
import { parseDeckList } from "../utils/deck_parser";
import { MtgCard, SCRYFALL } from "../api";
import { CARD_CACHE, CARD_TEMPLATE, currentWindows, ID, windowData } from "../index";

export function displayChyzMtgWindow(player: Player) {
  currentWindows.get(player)?.detach();
  const data = windowData.get(player) ?? new ChyzMtgWindowData();
  windowData.set(player, data);
  currentWindows.set(player, new ChyzMtgWindow(player, data).window);
}

const packageId = refPackageId;


export class ChyzMtgWindow {
  private readonly _window: Window;

  constructor(player: Player, data: ChyzMtgWindowData) {
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
        return new ChyzMtgWindowWidget(data, player.getCursorPosition());
      }
    };

    const target = new UIElement();
    target.position = player.getCursorPosition().add([0, 0, 0.001]);
    target.scale = 1 / 8;
    target.castShadow = false;
    target.twoSided = true;
    target.players.addPlayer(player);

    const targetDisplay = new ImageWidget().setImageSize(256,256).setImage("ui/target.png", packageId);

    let pulser = setInterval(() => {
      let time = world.getGameTime();
      targetDisplay.setTintColor([Math.sin(time) * 0.5 + 0.5, Math.sin(time + Math.PI * 2 / 3) * 0.5 + 0.5, Math.sin(time + Math.PI * 4 / 3) * 0.5 + 0.5, 1]);
    },0);

    target.widget = targetDisplay;
    world.addUI(target);

    const window = new Window(params, [player.getSlot()]).attach();
    window.onAllClosed.add(() => {
      world.removeUIElement(target);
      currentWindows.delete(player);
      clearInterval(pulser);
    });
    this._window = window;
  }

  public get window() {
    return this._window;
  }
}

export class ChyzMtgWindowWidget implements IWindowWidget {
  private readonly _data: ChyzMtgWindowData;
  private readonly _target: Vector;

  constructor(data: ChyzMtgWindowData, target: Vector) {
    this._data = data;
    this._target = target;
  }

  create(params: WindowWidgetParams): Widget {
    let deckInput = new MultilineTextBox().setMaxLength(2000).setText(this._data.deckInput);
    deckInput.onTextChanged.add((value) => this._data.deckInput = value.getText());

    let cardInput = new MultilineTextBox().setMaxLength(2000).setText(this._data.cardInput);
    cardInput.onTextChanged.add((value) => this._data.cardInput = value.getText());


    return render(
      <Tabs titles={["Deck", "Card"]} value={this._data.currentTab} onChange={tab => this._data.currentTab = tab}>
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
                    let cardObject = world.createObjectFromTemplate(CARD_TEMPLATE, this._target) as Card;
                    cardObject.setRotation([0, Math.round(player.getRotation()[1] / 90) * 90, 0]);
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
          {boxChild(1, cardInput)}
          <button>Load Card</button>
          <button onClick={async (button, player) => {
            await fetch(SCRYFALL + "cards/random").then(value => value.json()).then(mtgCard => {
              const card = mtgCard as MtgCard;
              if (card !== undefined) {
                const cardObject = world.createObjectFromTemplate(CARD_TEMPLATE, this._target);
                if (cardObject) {
                  CARD_CACHE.addToCaches(card);
                  cardObject.setRotation([0, Math.round(player.getRotation()[1] / 90) * 90, 0]);
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
  }

  destroy(): void {
  }

}

export class ChyzMtgWindowData {
  private readonly _persistentKey: NamespaceId | undefined;

  private _currentTab: number = 0;
  private _deckInput: string = "";
  private _cardInput: string = "";

  constructor(
    persistentKey?: NamespaceId,
    tab: number = 0,
    deckInput: string = "",
    cardInput: string = ""
  ) {
    this._persistentKey = persistentKey;
    this._currentTab = tab;
    this._deckInput = deckInput;
    this._cardInput = cardInput;
  }

  public get currentTab() {
    return this._currentTab;
  }

  public set currentTab(value: number) {
    this._currentTab = value;
  }

  public get deckInput() {
    return this._deckInput;
  }

  public set deckInput(value: string) {
    this._deckInput = value;
  }

  public get cardInput() {
    return this._cardInput;
  }

  public set cardInput(value: string) {
    this._cardInput = value;
  }
}
