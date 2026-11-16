import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import themeReducer from './slices/themeSlice';
import shuffleReducer from './slices/shuffleSlice';
import languageReducer from './slices/languageSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    shuffle: shuffleReducer,
    language: languageReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
