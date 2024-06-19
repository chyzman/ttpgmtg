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
    Slider, Button, UIZoomVisibility
} from "@tabletop-playground/api";

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
    let power = 2;
    let toughness = 3;
    let tapped = false;

    const size = obj.getSize();
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

    let powerDisplay = testImgPositionedChild(BLACK, canvas, new Text().setText("2").setFontSize(font).setJustification(TextJustification.Center), 521, 830, 50, 60);

    testImgPositionedChild(BLACK, canvas, new Text().setText("/").setFontSize(font).setJustification(TextJustification.Center), 571, 830, 20, 60);

    let toughnessDisplay = testImgPositionedChild(BLACK, canvas, new Text().setText("3").setFontSize(font).setJustification(TextJustification.Center), 591, 830, 50, 60);

    let powerIncreaser = imgPositionedChild(canvas, new Button().setText("+"), 521, 810, 60, 20);
    powerIncreaser.onClicked.add(() => power++);

    let powerDecreaser = imgPositionedChild(canvas, new Button().setText("-"), 521, 890, 60, 20);
    powerDecreaser.onClicked.add(() => power--);

    let toughnessIncreaser = imgPositionedChild(canvas, new Button().setText("+"), 591 - 10, 810, 60, 20);
    toughnessIncreaser.onClicked.add(() => toughness++);

    let toughnessDecreaser = imgPositionedChild(canvas, new Button().setText("-"), 591 - 10, 890, 60, 20);
    toughnessDecreaser.onClicked.add(() => toughness--);


    ui.widget = canvas;
    obj.addUI(ui);

    obj.onTick.add((o) => {
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
