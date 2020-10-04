import type { ColorIdentity, FormattedApiResponse } from "./types";

export default function filterByColorIdentity(
  colorIdentity: ColorIdentity[],
  combos: FormattedApiResponse[]
): FormattedApiResponse[] {
  return combos.filter((combo) => {
    if (combo.colorIdentity.length === 1 && combo.colorIdentity[0] === "c") {
      return true;
    }

    const colors = combo.colorIdentity.concat(colorIdentity);
    const colorSet = new Set(colors);

    return colorSet.size === colorIdentity.length;
  });
}
