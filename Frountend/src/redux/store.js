// 1=> Create store.js file to  Create Store to make data global 
// 2=> Create userSlice.js file to Create Action
// 3=> import reducer which we export from userSlice

import { configureStore } from '@reduxjs/toolkit'
// Reducer
import userReducer from "./user/userSlice";
export const store = configureStore({
  reducer: {user:userReducer},
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false
  }),
})
