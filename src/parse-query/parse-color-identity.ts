import parseColorFromValue from "./parse-color-from-value";

import type { SearchParameters } from "../types";

export default function parseColorIdentity(
  params: SearchParameters,
  key: string,
  operator: string,
  value: string
): void {
  if (Number(value) >= 0 && Number(value) < 6) {
    params.colorIdentity.sizeFilter.method = operator;
    params.colorIdentity.sizeFilter.value = Number(value);

    return;
  }

  params.colorIdentity.valueFilter.method = operator;
  params.colorIdentity.valueFilter.value = parseColorFromValue(value);
}
