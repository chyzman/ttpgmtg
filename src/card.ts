import {Color, GameObject, UIElement, refObject, Vector, Text, Canvas, Rotator, Border, Widget, TextJustification, Button, UIZoomVisibility, world, PlayerPermission, Card} from "@tabletop-playground/api";
import {loadMtg, CARD_CACHE} from "./Loader/chyzMtg";
import {UiVisibility} from "ttpg-darrell";
import {Card as ScryfallCard} from "scryfall-api";

const IMG_WIDTH = 672;
const IMG_HEIGHT = 936;
const SCALE = 1 / 16;

const BLACK: Color = new Color(0, 0, 0, 1);

let uiWidthMult = 0;
let uiHeightMult = 0;

((obj: GameObject) => {
    loadMtg(false);

    let card: ScryfallCard;

    obj.onTick.add(async (o) => {
        const thisCard = obj as Card;
        if (card === undefined) {
            if (thisCard.getCardDetails().textureOverrideURL !== "") {
                await CARD_CACHE.getCardFromUrl(new URL((obj as Card).getCardDetails().textureOverrideURL)).then(card => {
                    if (card !== undefined && card.image_uris?.png !== undefined) {
                        thisCard.setTextureOverrideURL(card.image_uris.png);
                        console.log(card);
                    }
                });
            }
        }
    });




    let power = 2;
    let toughness = 3;
    let tapped = false;

    const ui = createUIElement();
    const hoverUI = createUIElement(UIZoomVisibility.Regular);
    const zoomedUI = createUIElement(-IMG_WIDTH/100, UIZoomVisibility.ZoomedOnly);

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

    let testAbilities = testImgPositionedChild(BLACK, zoomedCanvas, new Text().setText("Testing abilities thingy here idfk man whatever").setAutoWrap(true).setFontSize(font), 0, 0, IMG_WIDTH, IMG_HEIGHT)

    ui.widget = canvas;
    hoverUI.widget = hoverCanvas;
    zoomedUI.widget = zoomedCanvas;

    const hoverUiVisibility = new UiVisibility(hoverUI, obj);

    // obj.addUI(ui);
    obj.addUI(hoverUI);
    // obj.addUI(zoomedUI);

    obj.onTick.add((o) => {
        powerDisplay.setText(power.toString());
        toughnessDisplay.setText(toughness.toString());
    });

    const interval = setInterval(() => {
        const permission = new PlayerPermission();
        world.getAllPlayers().forEach(player => {
            const pos = obj.worldPositionToLocal(player.getCursorPosition())
            const scale = obj.getScale()
            const extent = obj.getExtent(false, true)
            extent.x /= scale.x
            extent.y /= scale.y
            const isInside = pos.x >= -extent.x && pos.x <= extent.x && pos.y >= -extent.y && pos.y <= extent.y
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

    function createUIElement(offset: number = 0, zoomVisibility: number = UIZoomVisibility.Both) {
        const ui = new UIElement();
        ui.scale = SCALE;
        // ui.position = calculatePosition();
        ui.position = new Vector(0, 0, -0.05);
        ui.rotation = new Rotator(180, 180, 0);
        //its too late for me to know what the surrounding code does but jakob wrote it, ideally the hoverUI would be 3x the width of the card (+ padding ig) but idk how to do that so i just fucking moved it, pls fix
        // ui.position = ui.position.add(new Vector(0, offset, 0));
        ui.useWidgetSize = false;
        ui.width = obj.getSize().y * 10 / SCALE;
        ui.height = obj.getSize().x * 10 / SCALE;
        ui.zoomVisibility = zoomVisibility;
        uiWidthMult = ui.width / IMG_WIDTH;
        uiHeightMult = ui.height / IMG_HEIGHT;
        // const interval = setInterval(() => ui.position = calculatePosition(), 100);
        // obj.onDestroyed.add(() => clearInterval(interval));
        return ui;

        // function calculatePosition() {
        //     return new Vector(0, 0, -(obj.getSize().z / 2 + 1/1000))
        // }
    }
})(refObject);


function imgPositionedChild<T extends Widget>(canvas: Canvas, widget: T, x: number, y: number, width: number, height: number) {
    canvas.addChild(widget, x * uiWidthMult, y * uiHeightMult, width * uiWidthMult, height * uiHeightMult);
    return widget;
}

function testImgPositionedChild<T extends Widget>(color: Color, canvas: Canvas, widget: T, x: number, y: number, width: number, height: number) {
    imgPositionedChild(canvas, new Border().setColor(color).setChild(widget), x, y, width, height);
    return widget;
}
