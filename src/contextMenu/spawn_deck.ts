import { Card, Player, world } from "@tabletop-playground/api";

export const spawnDeck = (player: Player) => {
    const deckOCards = Symbol.for("my nuts")

    const spawnPos = player.getCursorPosition();

    const firstCard = world.createObjectFromTemplate("1B4898A44113ED6C0736F6985D74A079", spawnPos.add([0,0,10])) as Card;


    for(let i = 0; i < 1_000; i++) {
        firstCard.addCards(world.createObjectFromTemplate("1B4898A44113ED6C0736F6985D74A079", firstCard.getPosition().add([0,0,10])) as Card)
    }
}
