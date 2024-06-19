import { refObject } from "@tabletop-playground/api";
import { createGlobalContextOptions } from "./globalContext";

const obj = refObject;

obj.onCreated.add((obj) => {
    createGlobalContextOptions();
    obj.destroy();
})

obj.onTick.add((obj) => obj.destroy());



/* const screenUi = new ScreenUIElement()



    screenUi.anchorX = 0.5
    screenUi.anchorY = 0.5

    screenUi.relativePositionX = true
    screenUi.relativePositionY = true

    screenUi.positionX = 0.5
    screenUi.positionY = 0.5

    screenUi.width = 200


    let closeButton;
    screenUi.widget = new Border().setChild(
        new VerticalBox()
        .addChild(new Text().setText("idk what to put there").setJustification(1))
        .addChild(new TextBox())
        .addChild(closeButton = new Button().setText("Close").setJustification(1))
    )

    closeButton.onClicked.add((_, __) => {
        world.removeScreenUIElement(screenUi);
    })

    world.addScreenUI(screenUi); */
