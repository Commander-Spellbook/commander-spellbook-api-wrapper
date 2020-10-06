import type { ColorIdentityColors, FormattedApiResponse } from "./types";

export default function filterByColorIdentity(
  colorIdentity: ColorIdentityColors[],
  combos: FormattedApiResponse[]
): FormattedApiResponse[] {
  return combos.filter((combo) => {
    return combo.colorIdentity.hasColors(colorIdentity);
  });
}
