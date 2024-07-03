import { Border, Button, Card, Color, GameObject, HorizontalAlignment, PlayerPermission, refObject, Rotator, TextJustification, UIElement, UIZoomVisibility, Vector, VerticalBox, world } from "@tabletop-playground/api";
import { CARD_CACHE, CARD_UTIL, loadMtg } from "../Loader/chyzMtg";
import { MtgCard, MtgRulings } from "../api";
import { boxChild, jsxInTTPG, render } from "jsx-in-ttpg";
import { TriggerableMulticastDelegate } from "ttpg-darrell";
import { Counter, UI_SCALE, DEFAULT_ROTATION, autoSizeText } from "./types";

const IMG_WIDTH = 672;
const IMG_HEIGHT = 936;

const CARD_WIDTH = 6.383;
const CARD_HEIGHT = 8.898;

const BLACK: Color = new Color(0, 0, 0, 1);

((obj: GameObject) => {
  loadMtg(false);

  const card = obj as Card;

  card.onInserted.add(deck => deck.getUIs().map(ui => deck.removeUIElement(ui)));
  card.onRemoved.add(deck => initCard(deck));

  if (CARD_UTIL.isLooseCard(card)) initCard(card);
})(refObject);

function initCard(obj: Card) {
  if (!CARD_UTIL.isLooseCard(obj)) return;

  let card: MtgCard;
  let rulings: MtgRulings;

  let tapped = false;

  let showConfig = false;
  const configElement = createUiElement();
  const configToggled = new TriggerableMulticastDelegate<() => void>;

  let showInfoPanel = false;
  const infoPanelElement = createUiElement();
  let infoPanelTab = 0;
  const infoPanelToggled = new TriggerableMulticastDelegate<() => void>;

  let showPowerToughness = false;

  const power = new Counter();
  const toughness = new Counter();


  let showPlusOneCounters = false;
  const plusOneCounterElement = createUiElement();
  const plusOneCounterModifiersElement = createUiElement();
  const plusOneCounterToggled = new TriggerableMulticastDelegate<() => void>();


  let showLoyalty = false;

  const loyalty = new Counter();

  let showCounter = false;
  const counterElement = createUiElement();
  const counterModifiersElement = createUiElement();
  const counterToggled = new TriggerableMulticastDelegate<() => void>();

  let hovered = false;

  const hoverChecker = setInterval(() => {
    const scale = obj.getScale();
    const extent = obj.getExtent(false, true);
    extent.x /= scale.x;
    extent.y /= scale.y;
    hovered = world.getAllPlayers().some(player => {
      const pos = obj.worldPositionToLocal(player.getCursorPosition());
      const isInside = pos.x >= -extent.x && pos.x <= extent.x && pos.y >= -extent.y && pos.y <= extent.y;
      return isInside || player.getHighlightedObject() === obj;
    });
  }, 50);
  obj.onDestroyed.add(() => clearInterval(hoverChecker));

  const cardInitializer = setInterval(() => {
    if (obj.getCardDetails() !== undefined && obj.getCardDetails().textureOverrideURL !== undefined) {
      clearInterval(cardInitializer);
      fetchCard();
    }
  });

  const updateInfo = setInterval(() => {
    if (card !== undefined) {
      obj.setName(card.name);
      obj.setDescription(card.oracle_text !== undefined ? card.oracle_text : "");
    }
  }, 10);
  obj.onDestroyed.add(object => clearInterval(updateInfo));


  function initUI() {
    obj.getUIs().forEach(value => obj.removeUIElement(value));
    if (card === undefined) return;

    if (card.type_line.includes("Creature")) showPowerToughness = true;
    initPowerToughness();

    if (card.type_line.includes("Planeswalker")) showLoyalty = true;
    initLoyalty();

    showConfig = true;
    initConfigPanel();
  }

  function initPowerToughness() {
    // power.detach(obj);
    // toughness.detach(obj);
    // if (card === undefined) return;

    power.value = card.power;
    toughness.value = card.toughness;

    power.position = new Vector(-3.9, -2, -0.05);
    power.anchorX = 1;

    toughness.position = new Vector(-3.9, -2.3, -0.05);
    toughness.anchorX = 0;

    power.setAttached(obj, showPowerToughness);
    toughness.setAttached(obj, showPowerToughness);

    obj.onTick.add(object => {
      power.updateVisibility(hovered);
      toughness.updateVisibility(hovered);
    })

    let test = new Counter(10);

    test.position = new Vector(0, 0, -1);

    test.attach(obj);
  }

  function initLoyalty() {
    // loyalty.detach(obj);
    // if (card === undefined) return;

    loyalty.value = card.loyalty;

    loyalty.position = new Vector(-3.7, -2.43, -0.05);

    loyalty.setAttached(obj, showLoyalty);

    obj.onTick.add(object => {
      loyalty.updateVisibility(hovered);
    })
  }

  function initConfigPanel() {
    obj.removeUIElement(configElement);
    if (!showConfig) return;

    configElement.anchorX = 1;
    configElement.position = new Vector(0, 3.25, -0.05);
    configElement.castShadow = false;

    configElement.widget = render(
      <border>
        <layout
          width={CARD_WIDTH * 10 / UI_SCALE}
          height={CARD_HEIGHT * 10 / UI_SCALE}>
          <verticalbox>
            <checkbox
              size={56}
              label={"Show Power/Toughness"}
              checked={showPowerToughness}
              onChange={(checkbox, player, state) => {
                showPowerToughness = state;
                power.setAttached(obj, state);
                toughness.setAttached(obj, state)
              }}
            />
            <checkbox
              size={56}
              label={"Show Loyalty"}
              checked={showLoyalty}
              onChange={(checkbox, player, state) => {
                showLoyalty = state;
                loyalty.setAttached(obj, state);
              }}
            />
          </verticalbox>
        </layout>
      </border>
    );

    obj.addUI(configElement);
  }

  function fetchCard() {
    const thisCard = obj as Card;
    CARD_CACHE.getCardFromUrl(thisCard.getCardDetails().textureOverrideURL).then(mtgCard => {
      if (mtgCard !== undefined && mtgCard.image_uris?.png !== undefined) {
        card = mtgCard;
        initUI();
      } else {
        console.log("Card not found");
      }
    }, reason => console.error(reason));
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

  function createUiElement(): UIElement {
    let element = new UIElement();
    element.scale = UI_SCALE;
    element.rotation = DEFAULT_ROTATION;
    element.castShadow = false;
    return element;
  }

}


// function initRightPanel(tab: number = 0) {
//
//   let rightPanel = new UIElement();
//   rightPanel.scale = 1 / 8;
//   rightPanel.anchorX = 0;
//   rightPanel.position = new Vector(0, -3.25, -0.05);
//   //TODO fix make this angled inwards a bit once that's possible
//   rightPanel.rotation = DEFAULT_ROTATION;
//   rightPanel.castShadow = false;
//
//   let rulingsDisplay = new VerticalBox();
//
//
//   rightPanel.widget = render(
//     <canvas>
//       {canvasChild({ x: 0, y: 0, width: IMG_WIDTH, height: IMG_HEIGHT },
//         <layout
//           width={CARD_WIDTH * 10 * 8}
//           height={CARD_HEIGHT * 10 * 8}>
//           <Tabs
//             titles={["Info", "Rulings", "Nothing"]}
//             value={tab}
//             onChange={v => {
//             }}>
//             <verticalbox>
//               {
//                 card.oracle_text?.split("\n").map((line, _) => {
//                   return render(<border color={BLACK}>
//                     <text wrap={true}>
//                       {line}
//                     </text>
//                   </border>);
//                 })
//               }
//             </verticalbox>
//             {rulingsDisplay}
//             <verticalbox>
//               Idk what you expected man
//             </verticalbox>
//           </Tabs>
//         </layout>)}
//       {canvasChild({ x: 0, y: 0, width: IMG_WIDTH, height: IMG_HEIGHT },
//         <image onLoad={image => {
//         }} src={"rounded_rectangle.jpg"} />)}
//     </canvas>
//   );
//
//   //I know this is really terrible, but I'm tired and I don't wanna fix it rn
//   let rulingChecker = setInterval(() => {
//     if (rulings !== undefined) {
//       rulings.data.forEach(ruling => {
//         rulingsDisplay.addChild(
//           render(
//             <border color={BLACK}>
//               <text wrap={true}>
//                 {ruling.comment}
//               </text>
//             </border>
//           )
//         );
//       });
//       obj.updateUI(rightPanel);
//       clearInterval(rulingChecker);
//     }
//   }, 1000);
//
//   obj.addUI(rightPanel);
// }


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


// let test = createUiElement();
// test.position = new Vector(0, 0, -1);
// test.anchorX = 0;
//
// let browser = new WebBrowser();
// let browserLayout = new LayoutBox().setOverrideHeight(53).setOverrideWidth(10);
//
// browser.setURL(`
//     https://htmlpreview.github.io/?https://github.com/chyzman/ttpgmtg/blob/main/src/counter.html#${JSON.stringify({ value: power })}
//     `);
// browser.onURLChanged.add(browse => {
//   if (browse.getURL().lastIndexOf("#") !== -1) {
//     let data = JSON.parse(decodeURI(browse.getURL().slice(browse.getURL().lastIndexOf("#") + 1)));
//     power = data.value;
//     browserLayout.setOverrideWidth(Math.max(1,data.width+8));
//   }
// });
//
// test.widget = browserLayout.setChild(browser);
//
// obj.addUI(test);
