import { useSelector } from "react-redux";
import type { RootState } from "../store";
import { translateWidgetTitle } from "../translations/dashboardTranslations";

export const useWidgetTranslation = () => {
  const language = useSelector(
    (state: RootState) => state.language?.language || "en",
  );

  const t = (text: string): string => {
    return translateWidgetTitle(text, language);
  };

  return { language, t, isTamil: language === "ta" };
};

export default useWidgetTranslation;
