import {
    Color,
    GameObject,
    UIElement,
    refObject,
    Vector,
    Text,
    Canvas,
    Rotator,
    Border, Widget, TextJustification
} from "@tabletop-playground/api";

const SCRYFALL = "https://api.scryfall.com/";
const IMG_WIDTH = 672;
const IMG_HEIGHT = 936;
const SCALE = 1/16;

const RED: Color = new Color(1,0,0,1);
const BLUE: Color = new Color(0,0,1,1);

let uiWidthMult = 0;
let uiHeightMult = 0;

((obj: GameObject) => {
    const size = obj.getSize();
    const ui = new UIElement();
    
    ui.scale = SCALE;
    ui.position = new Vector(0, 0, -0.05);
    ui.rotation = new Rotator(180, 180, 0);
    ui.useWidgetSize = false;
    ui.width = obj.getSize().y * 10 / SCALE;
    ui.height = obj.getSize().x * 10 / SCALE;
    uiWidthMult = ui.width / IMG_WIDTH;
    uiHeightMult = ui.height / IMG_HEIGHT;
    
    let canvas = new Canvas();
    let label = new Text().setText("Test").setTextColor(RED).setFontSize(12);
    
    imgPositionedChild(canvas, new Text().setText(uiWidthMult.toString()), 0, 0, IMG_WIDTH, IMG_HEIGHT);
    imgPositionedChild(canvas, new Text().setText(uiHeightMult.toString()), 0, 10, IMG_WIDTH, IMG_HEIGHT);
    
    testImgPositionedChild(RED,canvas, new Text().setText(".").setJustification(TextJustification.Right), 538, 848, 38, 29);
    testImgPositionedChild(BLUE, canvas, new Text().setText("/").setJustification(TextJustification.Center), 576, 848, 13, 29);
    testImgPositionedChild(RED, canvas, new Text().setText(".").setJustification(TextJustification.Left), 589, 848, 38, 29);
    
    
    ui.widget = canvas;
    obj.addUI(ui);

})(refObject);
    
function imgPositionedChild(canvas: Canvas, widget: Widget, x: number, y: number, width: number, height: number) {
    return canvas.addChild(widget, x * uiWidthMult, y * uiHeightMult, width * uiWidthMult, height * uiHeightMult);
}
function testImgPositionedChild(color: Color, canvas: Canvas, widget: Widget | undefined, x: number, y: number, width: number, height: number) {
    return imgPositionedChild(canvas, new Border().setColor(color).setChild(widget), x, y, width, height);
}