import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type Language = "en" | "ta";

interface LanguageState {
  language: Language;
}

const getInitialLanguage = (): Language => {
  if (typeof window === "undefined") return "en";
  const saved = localStorage.getItem("app_language");
  return saved === "ta" ? "ta" : "en";
};

const initialState: LanguageState = {
  language: getInitialLanguage(),
};

export const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    toggleLanguage: (state) => {
      state.language = state.language === "en" ? "ta" : "en";
      if (typeof window !== "undefined") {
        localStorage.setItem("app_language", state.language);
      }
    },
    setLanguage: (state, action: PayloadAction<Language>) => {
      state.language = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("app_language", state.language);
      }
    },
  },
});

export const { toggleLanguage, setLanguage } = languageSlice.actions;
export default languageSlice.reducer;
