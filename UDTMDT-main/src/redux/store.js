// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit'
import cartReducer from './slides/cartSlice'

import userReducer from './slides/userSlice' 

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    user: userReducer, 
  },
})