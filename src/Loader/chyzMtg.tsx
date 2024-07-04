import { globalEvents, world } from "@tabletop-playground/api";
import { displayChyzMtgWindow } from "../ui/chyzMtgWindow";
import { CARD_CACHE, id, ID } from "../index";

let mtgLoaded = false;

export const loadMtg = (complainIfAlreadyLoaded: boolean = false) => {
  if (mtgLoaded) {
    if (complainIfAlreadyLoaded) {
      console.log(`${ID} is already loaded`);
    }
    return false;
  }
  loadCustomActions();

  mtgLoaded = true;
  world.getAllPlayers().forEach(player => player.showMessage(`${ID} is now loaded`));

  const queueResolver = setInterval(() => {
    CARD_CACHE.resolveQueue();
  }, 1000);

  return true;
};

const OPEN_MENU_ACTION = id("open_menu");

const loadCustomActions = () => {
  world.addCustomAction(`${ID}`, `open ${ID} Menu`, OPEN_MENU_ACTION);

  globalEvents.onCustomAction.add((player, id) => {
    switch (id) {
      case OPEN_MENU_ACTION: {
        displayChyzMtgWindow(player);
        break;
      }
    }
  });
};
