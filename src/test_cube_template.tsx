import { Color, GameObject, Player, refObject } from "@tabletop-playground/api";

((obj: GameObject) => {
    obj.addCustomAction("test", "idfk man", "test");

    obj.onTick.add((o) => {
        obj.setPrimaryColor(new Color(Math.random(), Math.random(), Math.random()))
    });

})(refObject);