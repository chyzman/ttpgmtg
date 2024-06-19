const parse = (url: string) => {
    switch (true) {
        case (url.includes("archidekt.com")): {
            break;
        }
        case (url.includes("moxfield.com")): {
            break;
        }
        case (url.includes("deckstats.net")): {
            break;
        }
    }
}

const parseDeckstats = (url: string) => {
    const [id, dickid] = url.split("decks/")[1].split('?')[0].split('-')[0].split('/');
    const formattedUrl = `https://deckstats.net/api.php?action=get_deck&id_type=saved&owner_id=${id}&id=${dickid}&response_type=list`
    fetch(formattedUrl).then(async res => await res.json()).then(data => data.list).then(data => {
        console.log(data);
    })
}