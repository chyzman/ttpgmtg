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

const IMG_WIDTH = 672;
const IMG_HEIGHT = 936;
const SCALE = 1 / 16;

const BLACK: Color = new Color(0, 0, 0, 1);

let uiWidthMult = 0;
let uiHeightMult = 0;

((obj: GameObject) => {
    loadMtg(false);
    let power = 2;
    let toughness = 3;
    let tapped = false;

    const ui = createUIElement();
    const hoverUI = createUIElement(UIZoomVisibility.Regular);
    const zoomedUI = createUIElement(UIZoomVisibility.ZoomedOnly);

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


    ui.widget = canvas;
    hoverUI.widget = hoverCanvas;
    zoomedUI.widget = zoomedCanvas;
    obj.addUI(ui);
    obj.addUI(hoverUI);
    obj.addUI(zoomedUI);

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
            if (isInside || player.getHighlightedObject() == obj) permission.addPlayer(player);
        });
        if (permission.value === 0) {
            obj.removeUIElement(hoverUI)
        } else if (!obj.getUIs().includes(hoverUI)) {
            obj.addUI(hoverUI)
        }
        if (hoverUI.players.value != permission.value) {
            hoverUI.players = permission;
            obj.updateUI(hoverUI);
        }
    }, 50);
    obj.onDestroyed.add(() => clearInterval(interval));

    function createUIElement(zoomVisibility: number = UIZoomVisibility.Both) {
        const ui = new UIElement();
        const getPosition = () => new Vector(0, 0, -(obj.getSize().z / 2 - 0.01));
        ui.scale = SCALE;
        ui.position = getPosition();
        ui.rotation = new Rotator(180, 180, 0);
        ui.useWidgetSize = false;
        ui.width = obj.getSize().y * 10 / SCALE;
        ui.height = obj.getSize().x * 10 / SCALE;
        ui.zoomVisibility = zoomVisibility;
        uiWidthMult = ui.width / IMG_WIDTH;
        uiHeightMult = ui.height / IMG_HEIGHT;
        const interval = setInterval(() => ui.position = getPosition());
        obj.onDestroyed.add(() => clearInterval(interval));
        return ui;
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
