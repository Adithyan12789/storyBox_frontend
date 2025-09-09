"use client";
import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import adminReducer from "./adminSlice";

import dashReducer from "./dashSlice";

import bannerSlice from "./bannerSlice";
import rewardSlice from "./rewardSlice"
import dialogueSlice from "./dialogueSlice"
import settingSlice from "./settingSlice"
import filmSlice from "./filmSlice"
import filmListSlice from "./filmListSlice"
import episodeListSlice from "./episodeListSlice"
import currencySlice from "./currencySlice"
import coinPlanSlice from "./coinPlanSlice"
import vipPlanSlice from "./vipPlanSlice"

export function makeStore() {
  return configureStore({
    reducer: {
      users: userSlice,
      admin: adminReducer,
      dialogue: dialogueSlice,
      dashboard: dashReducer,
      adsReward: rewardSlice,
      banner: bannerSlice,
      setting:settingSlice,
      films:filmSlice,
      filmsList:filmListSlice,
      episodeList:episodeListSlice,
      currency:currencySlice,
      coinPlan:coinPlanSlice,
      vipPlan:vipPlanSlice,
    },
  });
}
export const store = makeStore();

// export type RootStore = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;
// export const useAppDispatch: () => AppDispatch = useDispatch;
// export const useAppSelector: TypedUseSelectorHook<any> = useSelector;
