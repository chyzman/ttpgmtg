import { refObject } from "@tabletop-playground/api";
import { loadMtg } from "./chyzMtg";

const obj = refObject;

obj.onCreated.add((obj) => {
    loadMtg(true);
    obj.destroy();
})

obj.onTick.add((obj) => obj.destroy());
