// 1=> Create store.js file to  Create Store to make data global 
// 2=> Create userSlice.js file to Create Action
// 3=> import reducer which we export from userSlice
import { combineReducers,configureStore } from '@reduxjs/toolkit'

// perisist reducer is use to store data in localstorage , there is one reducer , one is store to store data
import { persistReducer,persistStore} from 'redux-persist'
 // import local storage from react-persist
 import storage from 'redux-persist/lib/storage'
// create combined reducer for all reducers to store their data
const mainReducer = combineReducers({user:userReducer})

// create cofigrateion fo localstorage, like storage name , key , version
const persistConfig = {
    key: 'root',
    version: 1,
    storage
};

// create persist reducer
const persistedReducer = persistReducer(persistConfig, mainReducer);

// Reducer
import userReducer from "./user/userSlice";
export const store = configureStore({
  reducer:persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false
  }),
});

// now here i export persist store to access it in our application ,imported in  main.jsx
export const persistor = persistStore(store);// actually we store our all state data in storage 
