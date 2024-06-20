const fetchDeckList = async (url: URL) => {
    console.log(`attempting to fetch decklist from "${url.hostname}"...`)
    switch (true) {
        case (url.hostname.includes("archidekt.com")): {
            console.log(`detected archidekt url: ${url}`)
            return parseArchidekt(url);
        }
        case (url.hostname.includes("mtggoldfish.com")): {
            console.log(`detected mtggoldfish url: ${url}`)
            break;
        }
        case (url.hostname.includes("moxfield.com")): {
            console.log(`detected moxfield url: ${url}`)
            break;
        }
        case (url.hostname.includes("aetherhub.com")): {
            console.log(`detected aetherhub url: ${url}`)
            break;
        }
        case (url.hostname.includes("deckstats.net")): {
            console.log(`detected deckstats url: ${url}`)
            return await parseDeckstats(url);
        }
        case (url.hostname.includes("mtgtop8.com")): {
            console.log(`detected mtgtop8 url: ${url}`)
            break
        }
        case (url.hostname.includes("mtgvault.com")): {
            console.log(`detected mtgvault url: ${url}`)
            break;
        }
        case (url.hostname.includes("cubecobra.com")): {
            console.log(`detected cubecobra url: ${url}`)
            break;
        }
        case (url.hostname.includes("tappedout.net")): {
            console.log(`detected tappedout url: ${url}`)
            break;
        }
        case (url.hostname.includes("deckbox.org")): {
            console.log(`detected deckbox url: ${url}`)
            break;
        }
        case (url.hostname.includes("manastack.com")): {
            console.log(`detected manastack url: ${url}`)
            break;
        }
        case (url.hostname.includes("deckedbuilder.com")): {
            console.log(`detected deckedbuilder url: ${url}`)
            break;
        }
        default: {
            console.log(`Unsupported URL: \"${url}\"`);
        }
    }
}

const parseArchidekt = (url: URL) => {
    const deckId = url.pathname.split("/")[2];
    fetch(`https://archidekt.com/api/decks/${deckId}/small/?format=json`)
        .then(async res => await res.json()).then(data => {
        const deckList: string[] = [];
        // idfk what's going on this doesn't appear to actually give you the fucking cards to make a decklist so idk what to do here lmao
        console.log(data);
    });
}


const parseDeckstats = async (url: URL) => {
    let path = url.pathname.split("/");
    //the deck list from deckstats is probably not exactly the format we need it in, idk what the format we need it in is yet tho so it is what it is for now
    return await fetch(`https://deckstats.net/api.php?action=get_deck&id_type=saved&owner_id=${path[2]}&id=${path[3].replace(/\D/g, "")}&response_type=list`)
        .then(async res => await res.json())
        .then(data => cleanDeckList(data.list.trim().split("\n")));
}


const cleanDeckList = (list: string[]) => {
    return list.filter(value => value.length > 0 && !value.startsWith("//"))
}

// this is for testing outside ttpg
console.log(await fetchDeckList(new URL("https://deckstats.net/decks/151892/2252888-zaxarra?lng=en")))
