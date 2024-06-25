import { Border, Canvas, Card, Color, GameObject, HorizontalAlignment, refObject, Rotator, Text, TextJustification, UIElement, UIZoomVisibility, Vector, VerticalBox, Widget } from "@tabletop-playground/api";
import { CARD_CACHE, loadMtg } from "./Loader/chyzMtg";
import { MtgCard } from "./api/card/types";
import { boxChild, jsxInTTPG, render } from "jsx-in-ttpg";
import { Dialog, Tabs } from "ttpg-trh-ui";
import { CounterWidget } from "./widget/counter";
import { MtgRuling, MtgRulings } from "./api/ruling/types";

const IMG_WIDTH = 672;
const IMG_HEIGHT = 936;

const CARD_WIDTH = 6.383;
const CARD_HEIGHT = 8.898;

const SCALE = 1 / 16;

const BLACK: Color = new Color(0, 0, 0, 1);

const DEFAULT_ROTATION = new Rotator(180, 180, 0);

((obj: GameObject) => {
  loadMtg(false);

  let card: MtgCard;
  let rulings: MtgRulings;

  fetchCard();

  let initialized = false;
  const init = setInterval(() => {
    if (card !== undefined && !initialized) {
      initUI();
      initialized = true;
      clearInterval(init);
    }
  }, 100);

  const updateInfo = setInterval(() => {
    if (card !== undefined) {
      obj.setName(card.name);
      obj.setDescription(card.oracle_text !== undefined ? card.oracle_text : "");
    }
  });
  obj.onDestroyed.add(object => clearInterval(updateInfo));


  function initUI() {
    obj.getUIs().forEach(value => obj.removeUIElement(value));
    if (card === undefined) return;

    let tapped = false;

    if (card.type_line.includes("Creature")) {
      if (card.power !== undefined && card.toughness !== undefined) {

        let power = card.power;
        let toughness = card.toughness;

        const powerToughnessHolder = new UIElement();
        powerToughnessHolder.scale = SCALE;
        powerToughnessHolder.position = new Vector(-3.75, -2, -0.05);
        powerToughnessHolder.rotation = DEFAULT_ROTATION;

        const powerDisplay = new Text().setText(power).setFontSize(48).setJustification(TextJustification.Center);
        const toughnessDisplay = new Text().setText(toughness).setFontSize(48).setJustification(TextJustification.Center);

        const confirmationHolder = new UIElement();
        confirmationHolder.scale = SCALE;
        confirmationHolder.position = new Vector(-3.75, -2, -0.1);
        confirmationHolder.rotation = DEFAULT_ROTATION;

        const counter = new CounterWidget(power);

        powerToughnessHolder.widget = render(
          <border>
            <layout width={220} height={125}>
              <horizontalbox>
                {counter.getWidget()}
                <contentbutton onClick={image => power = !isNaN(+power) ? (+power + 1).toString() : "1"
                }>{powerDisplay}</contentbutton>
                <button
                  size={48}
                  onClick={(button, player) => {
                    obj.removeUIElement(confirmationHolder);
                    confirmationHolder.widget = render(
                      <Dialog
                        title="Reset?">
                        <horizontalbox>
                          {boxChild(1, <button onClick={button => {
                            obj.removeUIElement(confirmationHolder);
                            power = card.power === undefined ? "0" : card.power;
                            toughness = card.toughness === undefined ? "0" : card.toughness;
                          }}>Yes
                          </button>)}
                          {boxChild(1, <button onClick={button => {
                            obj.removeUIElement(confirmationHolder);
                          }}>No
                          </button>)}
                        </horizontalbox>
                      </Dialog>
                    );
                    confirmationHolder.players.value = 0;
                    confirmationHolder.players.addPlayer(player);
                    obj.addUI(confirmationHolder);
                  }}>/
                </button>
                <contentbutton
                  onClick={image => toughness = !isNaN(+toughness) ? (+toughness + 1).toString() : "1"
                  }>
                  {toughnessDisplay}
                </contentbutton>
              </horizontalbox>
            </layout>
          </border>
        );

        obj.addUI(powerToughnessHolder);

        obj.onTick.add(() => {
          powerDisplay.setText(power.toString());
          toughnessDisplay.setText(toughness.toString());
        });
      }
    }

    let rightPanel = new UIElement();
    rightPanel.scale = 1 / 8;
    rightPanel.anchorX = 0;
    rightPanel.position = new Vector(0, -3.25, -0.05);
    //TODO fix make this angled inwards a bit once that's possible
    rightPanel.rotation = DEFAULT_ROTATION;
    rightPanel.castShadow = false;

    let rulingsDisplay = new VerticalBox();

    rightPanel.widget = render(
      <border>
        <layout
          width={CARD_WIDTH * 10 * 8}
          height={CARD_HEIGHT * 10 * 8}>
          <Tabs
            titles={["Info", "Rulings", "Nothing"]}
            onChange={v => {
            }}>
            <verticalbox>
              <border color={BLACK}>
                <text wrap={true}>
                  {card.oracle_text}
                </text>
              </border>
            </verticalbox>
            {rulingsDisplay}
            <verticalbox>
              Idk what you expected man
            </verticalbox>
          </Tabs>
        </layout>
      </border>
    );

    //I know this is really terrible, but I'm tired and I don't wanna fix it rn
    let rulingChecker = setInterval(() => {
      if (rulings !== undefined) {
        rulings.data.forEach(ruling => {
          rulingsDisplay.addChild(
            render(
              <border color={BLACK}>
                <text wrap={true}>
                  {ruling.comment}
                </text>
              </border>
            )
          );
        });
        obj.updateUI(rightPanel);
        clearInterval(rulingChecker);
      }
    }, 1000);

    obj.addUI(rightPanel);
  }


  function fetchCard() {
    const thisCard = obj as Card;
    CARD_CACHE.getCardFromUrl(thisCard.getCardDetails().textureOverrideURL).then(mtgCard => {
      if (mtgCard !== undefined && mtgCard.image_uris?.png !== undefined) {
        card = mtgCard;
        fetchRulings();
      } else {
        console.log("Card not found");
      }
    });
  }

  function fetchRulings() {
    if (card === undefined) return;
    CARD_CACHE.getRulingsFromCard(card).then(mtgRuling => {
      if (mtgRuling !== undefined) {
        rulings = mtgRuling;
      } else {
        console.log("Rulings not found");
      }
    });
  }

})(refObject);


/*
const ui = createUIElement();
const hoverUI = createUIElement(UIZoomVisibility.Regular);
const zoomedUI = createUIElement(-IMG_WIDTH / 100, UIZoomVisibility.ZoomedOnly);

const canvas = new Canvas();
const hoverCanvas = new Canvas();
const zoomedCanvas = new Canvas();

let font = 48;

let startX = 490;
let startY = 830;

let numWidth = 65;
let slashWidth = 20;
let height = 60;

let modifierHeight = 20;

let powerDisplay = testImgPositionedChild(BLACK, canvas, new Text().setText("2").setFontSize(font).setJustification(TextJustification.Center), startX, startY, numWidth, height);

testImgPositionedChild(BLACK, canvas, new Text().setText("/").setFontSize(font).setJustification(TextJustification.Center), startX + numWidth, startY, slashWidth, height);

let toughnessDisplay = testImgPositionedChild(BLACK, canvas, new Text().setText("3").setFontSize(font).setJustification(TextJustification.Center), startX + numWidth + slashWidth, startY, numWidth, height);

let powerIncreaser = imgPositionedChild(hoverCanvas, new Button().setText("+"), startX, startY - modifierHeight, numWidth, modifierHeight);
powerIncreaser.onClicked.add(() => power++);

let powerDecreaser = imgPositionedChild(hoverCanvas, new Button().setText("-"), startX, startY + height, numWidth, modifierHeight);
powerDecreaser.onClicked.add(() => power--);

let toughnessIncreaser = imgPositionedChild(hoverCanvas, new Button().setText("+"), startX + numWidth + slashWidth, startY - modifierHeight, numWidth, modifierHeight);
toughnessIncreaser.onClicked.add(() => toughness++);

let toughnessDecreaser = imgPositionedChild(hoverCanvas, new Button().setText("-"), startX + numWidth + slashWidth, startY + height, numWidth, modifierHeight);
toughnessDecreaser.onClicked.add(() => toughness--);

let testAbilities = testImgPositionedChild(BLACK, zoomedCanvas, new Text().setText("Testing abilities thingy here idfk man whatever").setAutoWrap(true).setFontSize(font), 0, 0, IMG_WIDTH, IMG_HEIGHT);

ui.widget = canvas;
hoverUI.widget = hoverCanvas;
zoomedUI.widget = zoomedCanvas;

const hoverUiVisibility = new UiVisibility(hoverUI, obj);

// obj.addUI(ui);
// obj.addUI(hoverUI);
// obj.addUI(zoomedUI);

obj.onTick.add((o) => {
  powerDisplay.setText(power.toString());
  toughnessDisplay.setText(toughness.toString());
});

const interval = setInterval(() => {
  const permission = new PlayerPermission();
  world.getAllPlayers().forEach(player => {
    const pos = obj.worldPositionToLocal(player.getCursorPosition());
    const scale = obj.getScale();
    const extent = obj.getExtent(false, true);
    extent.x /= scale.x;
    extent.y /= scale.y;
    const isInside = pos.x >= -extent.x && pos.x <= extent.x && pos.y >= -extent.y && pos.y <= extent.y;
    if ((isInside || player.getHighlightedObject() === obj) !== hoverUiVisibility.isVisibleToPlayer(player.getSlot())) {
      hoverUiVisibility.togglePlayer(player.getSlot());
    }
  });
  if (hoverUI.players.value !== permission.value) {
    hoverUI.players = permission;
    // obj.updateUI(ui);
    obj.updateUI(hoverUI);
    // obj.updateUI(zoomedUI);
  }
}, 50);
obj.onDestroyed.add(() => clearInterval(interval));

 */
