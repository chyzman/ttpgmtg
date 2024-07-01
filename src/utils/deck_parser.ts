import { MtgCard, MtgCardIdentifier } from "../api";

const fetchDeckList = async (url: URL) => {
  console.log(`attempting to fetch decklist from "${url.hostname}"...`);
  switch (true) {
    case (url.hostname.includes("archidekt.com")): {
      console.log(`detected archidekt url: ${url}`);
      return parseArchidekt(url);
    }
    case (url.hostname.includes("mtggoldfish.com")): {
      console.log(`detected mtggoldfish url: ${url}`);
      return "mtgGoldfish isn't setup yet, sorry!";
    }
    case (url.hostname.includes("moxfield.com")): {
      console.log(`detected moxfield url: ${url}`);
      return "moxfield isn't setup yet, sorry!";
    }
    case (url.hostname.includes("aetherhub.com")): {
      console.log(`detected aetherhub url: ${url}`);
      return "aetherhub isn't setup yet, sorry!";
    }
    case (url.hostname.includes("deckstats.net")): {
      console.log(`detected deckstats url: ${url}`);
      return await parseDeckstats(url);
    }
    case (url.hostname.includes("mtgtop8.com")): {
      console.log(`detected mtgtop8 url: ${url}`);
      return "mtgtop8 isn't setup yet, sorry!";
    }
    case (url.hostname.includes("mtgvault.com")): {
      console.log(`detected mtgvault url: ${url}`);
      return "mtgvault isn't setup yet, sorry!";
    }
    case (url.hostname.includes("cubecobra.com")): {
      console.log(`detected cubecobra url: ${url}`);
      return "cubecobra isn't setup yet, sorry!";
    }
    case (url.hostname.includes("tappedout.net")): {
      console.log(`detected tappedout url: ${url}`);
      return "tappedout isn't setup yet, sorry!";
    }
    case (url.hostname.includes("deckbox.org")): {
      console.log(`detected deckbox url: ${url}`);
      return "deckbox isn't setup yet, sorry!";
    }
    case (url.hostname.includes("manastack.com")): {
      console.log(`detected manastack url: ${url}`);
      return "manastack isn't setup yet, sorry!";
    }
    case (url.hostname.includes("deckedbuilder.com")): {
      console.log(`detected deckedbuilder url: ${url}`);
      return "deckedbuilder isn't setup yet, sorry!";
    }
    default: {
      console.log(`Unsupported URL: \"${url}\"`);
    }
  }
};

const parseArchidekt = (url: URL) => {
  const deckId = url.pathname.split("/")[2];
  fetch(`https://archidekt.com/api/decks/${deckId}/small/?format=json`)
    .then(async res => await res.json()).then(data => {
    const deckList: string[] = [];
    // idfk what's going on this doesn't appear to actually give you the fucking cards to make a decklist so idk what to do here lmao
  });
  return "Archidekt isnt setup yet, sorry!";
};


const parseDeckstats = async (url: URL) => {
  let path = url.pathname.split("/");
  //the deck list from deckstats is probably not exactly the format we need it in, idk what the format we need it in is yet tho so it is what it is for now
  return await fetch(`https://deckstats.net/api.php?action=get_deck&id_type=saved&owner_id=${path[2]}&id=${path[3].replace(/\D/g, "")}&response_type=list`)
    .then(async res => await res.json())
    .then(data => cleanDeckList(data.list.trim().split("\n")));
};


const cleanDeckList = (list: string[]) => {
  return list.filter(value => value.length > 0 && !value.startsWith("//"));
};

export const parseDeckList = (decklist: string): Array<{count:number, name: string, set?:string}> => {
  return decklist
    .trim()
    .split(/[\r\n]+/)
    .map(line => {
      let name = "";
      let setCode = "";
      let setNumber = "";
      let count = 1;
      let foundFirstWord = false;
      let couldBeSetNumber = false;
      let inOptions = false;
      line.split(/\s+/).forEach(word => {
        if (word.match(/^[#*^\[]/) || word.match(/[#*^\]]$/)) {
          inOptions = true;
        } else if (word.match(/^\([^\)]*\)$/)) {
          setCode = word.replace(/[\(\)]/g, "");
          couldBeSetNumber = true;
        } else if (couldBeSetNumber) {
          couldBeSetNumber = false;
          setNumber = word;
        } else if (!inOptions) {
          let parseAsName = true;
          if (!foundFirstWord) {
            const countMatch = word.match(/^(\d+)[xX]?$/);
            if (countMatch) {
              count = Number(countMatch[1]);
              parseAsName = false;
            }
          }
          if (parseAsName) {
            if (word.match(/^[/\\][/\\]?$/)) word = "//";
            if (name) {
              name += " " + word;
            } else {
              name = word;
            }
          }
        }
        foundFirstWord = true;
      });
      if (name === "") throw `Unparseable line in Decklist: ${line}`;
      return { count, name, set: setCode ? setCode : undefined };
    });
};
