import { Border, Button, Card, Color, GameObject, LayoutBox, PlayerPermission, refObject, Rotator, Text, UIElement, UIZoomVisibility, Vector, VerticalBox, WebBrowser, world } from "@tabletop-playground/api";
import { CARD_CACHE, CARD_UTIL, loadMtg } from "./Loader/chyzMtg";
import { MtgCard } from "./api/card/types";
import { jsxInTTPG, render } from "jsx-in-ttpg";
import { MtgRulings } from "./api/ruling/types";
import { TriggerableMulticastDelegate, UiVisibility } from "ttpg-darrell";

const IMG_WIDTH = 672;
const IMG_HEIGHT = 936;

const CARD_WIDTH = 6.383;
const CARD_HEIGHT = 8.898;

const SCALE = 1 / 16;

const BLACK: Color = new Color(0, 0, 0, 1);

const DEFAULT_ROTATION = new Rotator(180, 180, 0);

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

  const powerElement = createUiElement();
  const powerModifiersElement = createUiElement();

  const toughnessElement = createUiElement();
  const toughnessModifiersElement = createUiElement();

  const powerToughnessDivider = createUiElement();
  const powerToughnessToggled = new TriggerableMulticastDelegate<() => void>();


  let showPlusOneCounters = false;
  const plusOneCounterElement = createUiElement();
  const plusOneCounterModifiersElement = createUiElement();
  const plusOneCounterToggled = new TriggerableMulticastDelegate<() => void>();


  let showLoyalty = false;
  const loyaltyElement = createUiElement();
  const loyaltyModifiersElement = createUiElement();

  const loyaltyToggled = new TriggerableMulticastDelegate<() => void>();

  let showCounter = false;
  const counterElement = createUiElement();
  const counterModifiersElement = createUiElement();
  const counterToggled = new TriggerableMulticastDelegate<() => void>();

  let hovered = false;

  const hoverChecker = setInterval(() => {
    const permission = new PlayerPermission();
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
    obj.removeUIElement(powerElement);
    obj.removeUIElement(toughnessElement);
    obj.removeUIElement(powerToughnessDivider);

    obj.removeUIElement(powerModifiersElement);
    obj.removeUIElement(toughnessModifiersElement);

    if (card === undefined) return;

    const basePower = card.power || "0";
    const baseToughness = card.toughness || "0";

    let power = basePower;
    let toughness = baseToughness;

    powerElement.position = new Vector(-3.9, -2, -0.05);
    powerElement.anchorX = 1;
    powerElement.zoomVisibility = UIZoomVisibility.Both;

    powerModifiersElement.position = new Vector(-3.9, -2, -0.0499);
    powerModifiersElement.anchorX = 1;

    const powerBorder = new Border();
    powerBorder.setVisible(showPowerToughness);
    const powerButton = new Button().setText(power).setFontSize(autoSizeText(power));
    powerButton.onClicked.add(() => power = basePower);

    powerElement.widget = powerBorder.setChild(render(<layout height={100}>{powerButton}</layout>));

    const powerModifiers = new VerticalBox();
    powerModifiers.setVisible(showPowerToughness);
    const powerModifiersButton = new Button().setText(power).setFontSize(autoSizeText(power));

    powerModifiersElement.widget = powerModifiers.addChild(render(
      <verticalbox gap={0}>
        <border>
          <button onClick={() => power = !isNaN(+power) ? (+power + 1).toString() : "1"}>+</button>
        </border>
        <border>
          <layout height={100}>
            {powerModifiersButton}
          </layout>
        </border>
        <border>
          <button onClick={() => power = !isNaN(+power) ? (+power - 1).toString() : "-1"}>-</button>
        </border>
      </verticalbox>
    ));

    toughnessElement.position = new Vector(-3.9, -2.3, -0.05);
    toughnessElement.anchorX = 0;
    toughnessElement.zoomVisibility = UIZoomVisibility.Both;

    toughnessModifiersElement.position = new Vector(-3.9, -2.3, -0.0499);
    toughnessModifiersElement.anchorX = 0;

    const toughnessBorder = new Border();
    toughnessBorder.setVisible(showPowerToughness);
    const toughnessButton = new Button().setText(toughness).setFontSize(autoSizeText(toughness));
    toughnessButton.onClicked.add(() => toughness = baseToughness);

    toughnessElement.widget = toughnessBorder.setChild(render(<layout height={100}>{toughnessButton}</layout>));

    const toughnessModifiers = new VerticalBox();
    toughnessModifiers.setVisible(showPowerToughness);
    const toughnessModifiersButton = new Button().setText(toughness).setFontSize(autoSizeText(toughness));

    toughnessModifiersElement.widget = toughnessModifiers.addChild(render(
      <verticalbox gap={0}>
        <border>
          <button onClick={() => toughness = !isNaN(+toughness) ? (+toughness + 1).toString() : "1"}>+</button>
        </border>
        <border>
          <layout height={100}>
            {toughnessModifiersButton}
          </layout>
        </border>
        <border>
          <button onClick={() => toughness = !isNaN(+toughness) ? (+toughness - 1).toString() : "-1"}>-</button>
        </border>
      </verticalbox>
    ));

    powerToughnessDivider.position = new Vector(-3.9, -2.15, -0.05);
    powerToughnessDivider.anchorX = 0.5;
    powerToughnessDivider.zoomVisibility = UIZoomVisibility.Both;

    const dividerBorder = new Border();
    dividerBorder.setVisible(showPowerToughness);
    const divider = new Button().setText("/").setFontSize(autoSizeText("/"));
    divider.onClicked.add(() => {
      /*open editor or something IDK*/
    });

    powerToughnessDivider.widget = dividerBorder.setChild(render(<layout height={100}>{divider}</layout>));

    powerToughnessToggled.add(() => {
      powerBorder.setVisible(showPowerToughness);
      dividerBorder.setVisible(showPowerToughness);
      toughnessBorder.setVisible(showPowerToughness);
    });

    obj.onTick.add(object => {
      powerButton.setText(power);
      powerButton.setFontSize(autoSizeText(power));
      toughnessButton.setText(toughness);
      toughnessButton.setFontSize(autoSizeText(toughness));

      powerModifiersButton.setText(power);
      powerModifiersButton.setFontSize(autoSizeText(power));
      toughnessModifiersButton.setText(toughness);
      toughnessModifiersButton.setFontSize(autoSizeText(toughness));

      powerModifiers.setVisible(showPowerToughness && hovered);
      toughnessModifiers.setVisible(showPowerToughness && hovered);
    });

    obj.addUI(powerElement);
    obj.addUI(toughnessElement);
    obj.addUI(powerToughnessDivider);

    obj.addUI(powerModifiersElement);
    obj.addUI(toughnessModifiersElement);

    let test = createUiElement();
    test.position = new Vector(0, 0, -1);

    let browser = new WebBrowser();
    let browserLayout = new LayoutBox();

    browser.setURL(`
    https://htmlpreview.github.io/?https://github.com/chyzman/ttpgmtg/blob/main/src/counter.html#${JSON.stringify({ value: power })}
    `);
    browser.onLoadFinished.add(browse => {
      if (browse.getURL().lastIndexOf("#") !== -1) {
        let data = JSON.parse(decodeURI(browse.getURL().slice(browse.getURL().lastIndexOf("#") + 1)));
        power = data.value;
        browserLayout.setOverrideWidth(Math.min(100,data.width));
      }
    });

    test.widget = browserLayout.setChild(browser)

    obj.addUI(test);

  }

  function initLoyalty() {
    obj.removeUIElement(loyaltyElement);
    if (card === undefined) return;

    const baseLoyalty = card.loyalty || "0";

    let loyalty = baseLoyalty;

    loyaltyElement.position = new Vector(-3.7, -2.43, -0.05);
    loyaltyElement.anchorX = 0.5;
    loyaltyElement.zoomVisibility = UIZoomVisibility.Both;

    const loyaltyBorder = new Border();
    loyaltyBorder.setVisible(showLoyalty);
    const loyaltyButton = new Button().setText(loyalty).setFontSize(autoSizeText(loyalty));
    loyaltyButton.onClicked.add(() => {
      /*open editor or something IDK*/
    });

    loyaltyElement.widget = loyaltyBorder.setChild(render(<layout height={100}>{loyaltyButton}</layout>));

    loyaltyToggled.add(() => {
      loyaltyBorder.setVisible(showLoyalty);
    });

    obj.addUI(loyaltyElement);
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
          width={CARD_WIDTH * 10 / SCALE}
          height={CARD_HEIGHT * 10 / SCALE}>
          <verticalbox>
            <checkbox
              size={56}
              label={"Show Power/Toughness"}
              checked={showPowerToughness}
              onChange={(checkbox, player, state) => {
                showPowerToughness = state;
                powerToughnessToggled.trigger();
              }}
            />
            <checkbox
              size={56}
              label={"Show Loyalty"}
              checked={showLoyalty}
              onChange={(checkbox, player, state) => {
                showLoyalty = state;
                loyaltyToggled.trigger();
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

  function autoSizeText(text: string, min: number = 20, max: number = 56) {
    return Math.max(min, Math.min(max, max / (text.length / 3)));
  }

  function createUiElement(): UIElement {
    let element = new UIElement();
    element.scale = SCALE;
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
