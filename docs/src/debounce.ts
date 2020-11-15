// adapted from https://davidwalsh.name/javascript-debounce-function

type UnknownFunction = (...args: unknown[]) => void;

export default function debounce(
  func: UnknownFunction,
  wait: number,
  immediate: boolean
): UnknownFunction {
  let timeout: ReturnType<typeof setTimeout> | null;

  return (...args: unknown[]) => {
    const callNow = immediate && !timeout;
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };

    clearTimeout(timeout as ReturnType<typeof setTimeout>);
    timeout = setTimeout(later, wait);
    if (callNow) func(...args);
  };
}
