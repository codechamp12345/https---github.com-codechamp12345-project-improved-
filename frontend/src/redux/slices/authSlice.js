import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null,
  adminInfo: localStorage.getItem("adminInfo")
    ? JSON.parse(localStorage.getItem("adminInfo"))
    : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      localStorage.setItem("userInfo", JSON.stringify(action.payload));
    },
    updatePoints: (state, action) => {
      if (state.userInfo) {
        state.userInfo.points = action.payload.points;
        localStorage.setItem("userInfo", JSON.stringify(state.userInfo));
      }
    },
    logout: (state, action) => {
      if (action.payload === 'admin') {
        state.adminInfo = null;
        localStorage.removeItem("adminInfo");
      } else {
        state.userInfo = null;
        localStorage.removeItem("userInfo");
      }
      // Clear both states if no specific type is provided
      if (!action.payload) {
        state.userInfo = null;
        state.adminInfo = null;
        localStorage.removeItem("userInfo");
        localStorage.removeItem("adminInfo");
      }
    },
    clearCredentials: (state) => {
      state.userInfo = null;
      state.adminInfo = null;
      localStorage.removeItem("userInfo");
      localStorage.removeItem("adminInfo");
    },
  },
});

export const { setCredentials, updatePoints, logout, clearCredentials } = authSlice.actions;

export default authSlice.reducer;
