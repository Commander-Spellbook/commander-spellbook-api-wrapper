// adapted from https://davidwalsh.name/javascript-debounce-function

export default function debounce(
  func: (...args: unknown[]) => void,
  wait: number,
  immediate: boolean
) {
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
