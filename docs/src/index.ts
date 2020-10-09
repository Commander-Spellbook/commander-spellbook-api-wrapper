"use strict";

import spellbook = require("../../src/");
import type { FormattedApiResponse } from "../../src/types";

const button = document.getElementById("submit") as HTMLButtonElement;

function renderResults(combos: FormattedApiResponse[]) {
  const table = document.getElementById(
    "table-body"
  ) as HTMLTableSectionElement;
  table.innerHTML = "";
  combos.forEach((combo) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td></td>
    `;

    const td = document.createElement("td");
    td.classList.add("spellbook-image");
    combo.cards.forEach((card) => {
      const p = document.createElement("p");
      p.appendChild(card.toHTML());
      td.appendChild(p);
    });
    row.appendChild(td);
    [combo.prerequisites, combo.steps, combo.result].forEach((list) => {
      const td = document.createElement("td");
      td.classList.add("spellbook-list");
      td.appendChild(list.toHTMLOrderedList());

      row.appendChild(td);
    });

    table.appendChild(row);
  });
}

button.addEventListener("click", () => {
  button.setAttribute("disabled", "true");
  const cards = Array.from(
    document.querySelectorAll<HTMLInputElement>("input.input")
  )
    .map((input) => {
      return input.value;
    })
    .filter((value) => value);

  if (cards.length === 0) {
    button.removeAttribute("disabled");
    return;
  }

  spellbook
    .search({
      cards,
    })
    .then((combos) => {
      renderResults(combos);

      button.removeAttribute("disabled");
    });
});
