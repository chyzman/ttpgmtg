import { Color, GameObject, Player, UIElement, refObject, Vector, Text, Canvas, Rotator, HorizontalBox, Button, LayoutBox } from "@tabletop-playground/api";

const SCRYFALL = "https://api.scryfall.com/";

((obj: GameObject) => {
    const size = obj.getSize();

    const ui = new UIElement();

    ui.rotation = new Rotator(180, 180, 0);
    ui.position = new Vector(size.x/2,size.y/2,-size.z / 2 - 0.01);
    ui.useWidgetSize = false;
    ui.width = size.x/0.05;
    ui.height = size.y/0.05;
    ui.scale = 0.05;

    let canvas = new Canvas();
    ui.widget = canvas;

    let powerToughnessHolder = new HorizontalBox();

    let powerDisplay = new Button().setText("13").setFontSize(100);
    let powerToughnessDivider = new Text().setText("/").setFontSize(100);
    let toughnessDisplay = new Button().setText("27").setFontSize(100); 
    
    powerToughnessHolder.addChild(powerDisplay).addChild(powerToughnessDivider).addChild(toughnessDisplay);

    let ptLayout = new LayoutBox();
    ptLayout.setChild(powerToughnessHolder);

    canvas.addChild(ptLayout, 0, 0, 100, 200)
    
    obj.addUI(ui);

})(refObject);  