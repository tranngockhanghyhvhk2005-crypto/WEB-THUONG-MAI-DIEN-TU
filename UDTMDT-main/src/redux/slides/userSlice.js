import { createSlice } from '@reduxjs/toolkit';

const getInitialUser = () => {
    try {
        const user = localStorage.getItem('user'); 
        if (!user) return null;
        const parsedUser = JSON.parse(user);
        return parsedUser.data || parsedUser;
    } catch (error) {
        return null;
    }
};

const initialState = {
  currentUser: getInitialUser(), 
  isLoading: false,
  error: false,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      // Kiểm tra xem payload có chứa trường 'data' không
      const userData = action.payload.data || action.payload;
      
      state.currentUser = userData;
      state.isLoading = false;
      state.error = false;
      
      // Chỉ lưu info user vào localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Lưu token riêng (nếu có)
      if (action.payload.access_token) {
          localStorage.setItem('access_token', JSON.stringify(action.payload.access_token));
      }
    },
    logout: (state) => {
      state.currentUser = null;
      state.isLoading = false;
      state.error = false;
      
      localStorage.removeItem('user');
      localStorage.removeItem('access_token');
    },
    updateUser: (state, action) => {
      const updatedUser = { ...state.currentUser, ...action.payload };
      state.currentUser = updatedUser;
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  },
});

export const { loginSuccess, logout, updateUser } = userSlice.actions;
export default userSlice.reducer;