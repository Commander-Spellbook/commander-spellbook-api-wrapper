import type { FormattedApiResponse } from "../../src/types";

export default function renderResults(
  resultsNode: HTMLDivElement,
  combos: FormattedApiResponse[]
): void {
  const cardElements = combos.map((combo) => {
    const id = String(combo.commanderSpellbookId);
    const existingNode = document.querySelector(`[data-spellbook-id="${id}"]`);

    if (existingNode) {
      return existingNode;
    }

    const card = document.createElement("div");
    card.setAttribute("data-spellbook-id", id);
    card.classList.add("max-w-sm", "lg:max-w-full", "lg:w-1/2");
    card.innerHTML = `
		<div class="bg-gray-200 border-r border-l border-t border-gray-400 h-48 lg:h-auto flex-none bg-cover rounded-t text-center overflow-hidden ml-2 mr-2 mt-2 flex items-center spellbook-cards"></div>

    <div class="m-2 mt-0 flex">
      <div class="bg-gray-200 border-r border-b border-l border-t border-gray-400 h-48 lg:h-auto lg:w-48 flex bg-cover text-center overflow-hidden flex-none rounded-bl">
					<div class="flex content-center flex-wrap">
						<div class="text-base spellbook-card-names"></div>
						<div class="px-6 py-4 spellbook-ci text-center"></div>
					</div>
        </div>
        <div class="border-r border-b border-l border-gray-400 lg:border-l-0 lg:border-t lg:border-gray-400 bg-white flex flex-col justify-between leading-normal rounded-br">
          <div class="p-4">
            <div class="mb-8">
              <p class="text-sm text-gray-600 flex items-center">
                Prerequisites
              </p>
              <div class="text-gray-700 text-base ml-5 spellbook-card-prerequisites"></div>
            </div>
            <div class="mb-8">
              <p class="text-sm text-gray-600 flex items-center">
                Steps
              </p>
              <div class="text-gray-700 text-base ml-5 spellbook-card-steps"></div>
            </div>

            <div class="mb-1">
              <p class="text-sm text-gray-600 flex items-center">
                Results
              </p>
              <div class="mt-2">
                ${combo.results
                  .map((r) => {
                    return (
                      '<span class="inline-block bg-gray-200 rounded px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">' +
                      r +
                      "</span>"
                    );
                  })
                  .join("\n")}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    const cardsElement = card.querySelector(
      ".spellbook-cards"
    ) as HTMLDivElement;
    const names = card.querySelector(".spellbook-card-names") as HTMLDivElement;
    combo.cards
      .map((c) => {
        const cardElement = c.toHTML({
          skipName: true,
          className: "spellbook-art-crop",
        });
        cardElement.style.backgroundImage = `url('${c.getScryfallImageUrl(
          "art_crop"
        )}')`;

        return cardElement;
      })
      .forEach((c) => {
        cardsElement.appendChild(c);
      });

    combo.cards.forEach((c) => {
      const div = document.createElement("div");
      div.appendChild(c.toHTML());
      names.appendChild(div);
    });

    card
      .querySelector(".spellbook-ci")
      ?.appendChild(combo.colorIdentity.toHTML());

    card.querySelector(".spellbook-card-prerequisites")?.appendChild(
      combo.prerequisites.toHTMLOrderedList({
        className: "text-gray-700 text-base list-decimal",
      })
    );
    card.querySelector(".spellbook-card-steps")?.appendChild(
      combo.steps.toHTMLOrderedList({
        className: "text-gray-700 text-base list-decimal",
      })
    );

    return card;
  });
  resultsNode.innerHTML = "";
  cardElements.forEach((card) => {
    resultsNode.appendChild(card);
  });

  if (cardElements.length === 0) {
    document.getElementById("loader")?.classList.remove("hidden");
    (document.getElementById("loader-text") as HTMLDivElement).innerText =
      "(no cards found matching that search criteria, try something else)";
  } else {
    document.getElementById("loader")?.classList.add("hidden");
  }
}
