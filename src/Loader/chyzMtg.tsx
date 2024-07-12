import { CardHolder, GameObject, globalEvents, world } from "@tabletop-playground/api";
import { displayChyzMtgWindow } from "../ui/chyzMtgWindow";
import { CARD_CACHE, CARD_TEMPLATE, id, ID } from "../index";
import { MagicCard } from "../card/card";

let mtgLoaded = false;

export const loadMtg = (complainIfAlreadyLoaded: boolean = false) => {
  if (mtgLoaded) {
    if (complainIfAlreadyLoaded) {
      console.log(`${ID} is already loaded`);
    }
    return false;
  }
  loadCustomActions();
  loadCardEvents();

  mtgLoaded = true;
  world.getAllPlayers().forEach(player => player.showMessage(`${ID} is now loaded`));

  const queueResolver = setInterval(() => {
    CARD_CACHE.resolveQueue();
  }, 1000);

  return true;
};

const OPEN_MENU_ACTION = id("open_menu");

function loadCustomActions() {
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

function loadCardEvents() {
  world.getAllObjects(true).forEach(obj => addCardHolderEvents(obj));
  globalEvents.onObjectCreated.add(obj => addCardHolderEvents(obj));

  function addCardHolderEvents(obj: GameObject) {
    if (obj instanceof CardHolder) {
      obj.onInserted.add((holder, card) => {
        if (card.getTemplateId() == CARD_TEMPLATE) { // @ts-ignore
          card.removeVisuals();
        }
      });
      obj.onRemoved.add((holder, card) => {
        if (card.getTemplateId() == CARD_TEMPLATE) { // @ts-ignore
          card.tryInit();
        }
      });
    }
  }
}
