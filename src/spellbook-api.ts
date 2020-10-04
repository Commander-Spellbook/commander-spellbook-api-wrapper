import superagent from "superagent";
import type {
  CommanderSpellbookCombos,
  CommanderSpellbookAPIResponse,
  FormattedApiResponse,
} from "./types";

const API_ENDPOINT =
  "https://sheets.googleapis.com/v4/spreadsheets/1JJo8MzkpuhfvsaKVFVlOoNymscCt-Aw-1sob2IhpwXY/values:batchGet?ranges=combos!A2:Q&key=AIzaSyDzQ0jCf3teHnUK17ubaLaV6rcWf9ZjG5E";
const SIX_HOURS = 2160000;

let cachedPromise: Promise<FormattedApiResponse[]>;
let cachePromiseTimeout: ReturnType<typeof setTimeout>;
let useCachedResponse = false;

function formatApiResponse(
  apiResponse: CommanderSpellbookCombos
): FormattedApiResponse[] {
  return apiResponse
    .filter((combo) => {
      // ensures the spreadsheet has all values needed
      return combo.length > 13;
    })
    .map((combo) => {
      const id = combo[0];
      const cards = [
        combo[1],
        combo[2],
        combo[3],
        combo[4],
        combo[5],
        combo[6],
        combo[7],
        combo[8],
        combo[9],
        combo[10],
      ].filter((cardName) => cardName);

      const colorIdentity = combo[11].split(",").sort();
      const prerequisites = combo[12].split(/\.\s?/).filter((c) => c);
      const steps = combo[13].split(/\.\s?/).filter((c) => c);
      const result = combo[14].split(/\.\s?/).filter((c) => c);

      return {
        commanderSpellbookId: Number(id),
        permalink: `https://commanderspellbook.com/?id=${id}`,
        cards,
        colorIdentity,
        prerequisites,
        steps,
        result,
      };
    });
}

export default function lookupApi(): Promise<FormattedApiResponse[]> {
  if (useCachedResponse) {
    return cachedPromise;
  }

  cachedPromise = superagent
    .get(API_ENDPOINT)
    .then((res) => {
      const apiResponse = res.body as CommanderSpellbookAPIResponse;

      return apiResponse.valueRanges[0].values;
    })
    .then((values) => formatApiResponse(values));

  useCachedResponse = true;

  cachePromiseTimeout = setTimeout(() => {
    useCachedResponse = false;
  }, SIX_HOURS);

  return cachedPromise;
}

export function resetCache(): void {
  clearTimeout(cachePromiseTimeout);
  useCachedResponse = false;
}
