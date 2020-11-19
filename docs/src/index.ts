import scryfall = require("scryfall-client");
import spellbook = require("../../src/");
import debounce from "./debounce";
import renderResults from "./render-results";
import "./index.css";

const results = document.getElementById("results") as HTMLDivElement;
const colorIdentity = ["w", "u", "b", "r", "g"];

const cards = document.getElementById("cards-input") as HTMLTextAreaElement;
Array.from(document.querySelectorAll<HTMLSpanElement>(".mana-symbol")).forEach(
  (manaSymbolElement) => {
    const manaSymbol = manaSymbolElement.getAttribute(
      "data-mana-symbol"
    ) as string;
    const img = document.createElement("img");

    img.src = scryfall.getSymbolUrl(manaSymbol);

    manaSymbolElement.appendChild(img);
  }
);
Array.from(
  document.querySelectorAll<HTMLSpanElement>(".color-filter-input")
).forEach((el) => {
  const manaSymbol = el.getAttribute("data-mana-symbol") as string;
  el.addEventListener("click", () => {
    if (el.classList.contains("opacity-25")) {
      el.classList.remove("opacity-25");
      colorIdentity.push(manaSymbol);
    } else {
      el.classList.add("opacity-25");
      const index = colorIdentity.indexOf(manaSymbol);
      colorIdentity.splice(index, 1);
    }

    search(colorIdentity.join(""));
  });
});

function search(colorIdentity: string) {
  if (!cards.value || cards.value.length < 4) {
    return;
  }

  const value = cards.value
    .split("\n")
    .filter((v) => v)
    .join("");

  if (value.length === 0) {
    return;
  }

  spellbook.search(`${value} ci:${colorIdentity}`).then((combos) => {
    renderResults(results, combos);
  });
}
cards.addEventListener(
  "input",
  debounce(
    () => {
      search(colorIdentity.join(""));
    },
    500,
    false
  )
);
