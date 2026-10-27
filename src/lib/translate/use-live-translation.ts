import { useEffect, useState } from "react";
import type { Lang } from "./protocol";
import type { Translation, Translator } from "./use-translator";

export type Live = { result: Translation | null; error: string | null; busy: boolean };

/** Tłumaczy na bieżąco; przy pisaniu czeka, aż palce się zatrzymają. */
export function useLiveTranslation(
  translator: Translator,
  text: string,
  from: Lang,
  to: Lang,
  delay = 0,
): Live {
  const [state, setState] = useState<Live>({ result: null, error: null, busy: false });
  const { translate } = translator;
  useEffect(() => {
    const source = text.trim();
    if (!source) {
      setState({ result: null, error: null, busy: false });
      return;
    }
    let cancelled = false;
    setState((prev) => ({ ...prev, error: null, busy: true }));
    const timer = setTimeout(() => {
      translate(source, from, to).then(
        (result) => !cancelled && setState({ result, error: null, busy: false }),
        (error: unknown) =>
          !cancelled &&
          setState({
            result: null,
            error: error instanceof Error ? error.message : "Nie udało się przetłumaczyć.",
            busy: false,
          }),
      );
    }, delay);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [translate, text, from, to, delay]);
  return state;
}
