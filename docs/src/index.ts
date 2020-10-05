"use strict";

import spellbook = require("../../src/");
import type { FormattedApiResponse } from "../../src/types";

const button = document.getElementById("submit") as HTMLButtonElement;

function wrapInParagraph(items: string[]): string {
  const listItems = items.map((item) => "<li>" + item + "</li>").join("\n");

  return `<ul>${listItems}</ul>`;
}

function renderResults(combos: FormattedApiResponse[]) {
  const table = document.getElementById(
    "table-body"
  ) as HTMLTableSectionElement;
  table.innerHTML = "";
  combos.forEach((combo) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td></td>
      <td>
      <p>${combo.colorIdentity.join(",")}</p>
      ${wrapInParagraph(combo.cards)}
      </td>
    `;
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

  console.log("cards inputs", cards);

  spellbook
    .search({
      cards,
    })
    .then((combos) => {
      console.log(combos);
      renderResults(combos);

      button.removeAttribute("disabled");
    });
});
