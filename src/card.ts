import {
    Color,
    GameObject,
    UIElement,
    refObject,
    Vector,
    Text,
    Canvas,
    Rotator,
    Border,
    Widget,
    TextJustification,
    Slider, Button, UIZoomVisibility, world, PlayerPermission
} from "@tabletop-playground/api";
import {loadMtg} from "./Loader/chyzMtg";

const SCRYFALL = "https://api.scryfall.com/";
const IMG_WIDTH = 672;
const IMG_HEIGHT = 936;
const SCALE = 1 / 16;

const RED: Color = new Color(1, 0, 0, 1);
const BLUE: Color = new Color(0, 0, 1, 1);
const BLACK: Color = new Color(0, 0, 0, 1);

let uiWidthMult = 0;
let uiHeightMult = 0;

((obj: GameObject) => {
    loadMtg(false);
    let power = 2;
    let toughness = 3;
    let tapped = false;

    const ui = new UIElement();

    ui.scale = SCALE;
    ui.position = new Vector(0, 0, -0.05);
    ui.rotation = new Rotator(180, 180, 0);
    ui.useWidgetSize = false;
    ui.width = obj.getSize().y * 10 / SCALE;
    ui.height = obj.getSize().x * 10 / SCALE;
    ui.zoomVisibility = UIZoomVisibility.Both;
    uiWidthMult = ui.width / IMG_WIDTH;
    uiHeightMult = ui.height / IMG_HEIGHT;

    let canvas = new Canvas();

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

    let powerIncreaser = imgPositionedChild(canvas, new Button().setText("+"), startX, startY - modifierHeight, numWidth, modifierHeight);
    powerIncreaser.onClicked.add(() => power++);

    let powerDecreaser = imgPositionedChild(canvas, new Button().setText("-"), startX, startY + height, numWidth, modifierHeight);
    powerDecreaser.onClicked.add(() => power--);

    let toughnessIncreaser = imgPositionedChild(canvas, new Button().setText("+"), startX + numWidth + slashWidth, startY - modifierHeight, numWidth, modifierHeight);
    toughnessIncreaser.onClicked.add(() => toughness++);

    let toughnessDecreaser = imgPositionedChild(canvas, new Button().setText("-"), startX + numWidth + slashWidth, startY + height, numWidth, modifierHeight);
    toughnessDecreaser.onClicked.add(() => toughness--);


    ui.widget = canvas;
    obj.addUI(ui);

    obj.onTick.add((o) => {
        const permission = new PlayerPermission();
        world.getAllPlayers().forEach(player => {
            const pos = o.worldPositionToLocal(player.getCursorPosition())
            const scale = o.getScale()
            const extent = o.getExtent(false, true)
            extent.x /= scale.x
            extent.y /= scale.y
            const isInside = pos.x >= -extent.x && pos.x <= extent.x && pos.y >= -extent.y && pos.y <= extent.y
            if (isInside || player.getHighlightedObject() == obj) permission.addPlayer(player);
        });
        if (ui.players.value != permission.value) {
            ui.players = permission;
            o.updateUI(ui);
        }

        powerDisplay.setText(power.toString());
        toughnessDisplay.setText(toughness.toString());
    });
})(refObject);

function imgPositionedChild<T extends Widget>(canvas: Canvas, widget: T, x: number, y: number, width: number, height: number) {
    canvas.addChild(widget, x * uiWidthMult, y * uiHeightMult, width * uiWidthMult, height * uiHeightMult);
    return widget;
}

function testImgPositionedChild<T extends Widget>(color: Color, canvas: Canvas, widget: T, x: number, y: number, width: number, height: number) {
    imgPositionedChild(canvas, new Border().setColor(color).setChild(widget), x, y, width, height);
    return widget;
}

const makeCanvas = (obj: GameObject) => {

}
