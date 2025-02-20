import { createSlice } from "@reduxjs/toolkit";

export interface IUserDetailsSlice {
  id: string;
  userEmail: string;
  name: string;
  phone?: string;
  location?: string;
  website?: string;
  utmSource?: string;
  isActive: boolean;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
  loginOTP?: string;
  loginOTPSentAt?: string;
  message?: string;
}

const initialState: IUserDetailsSlice = {
  id: "",
  userEmail: "",
  name: "",
  phone: "",
  location: "",
  website: "",
  utmSource: "",
  isActive: false,
  createdBy: "",
  createdAt: "",
  updatedAt: "",
  loginOTP: "",
  loginOTPSentAt: "",
  message: "",
};

export const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    userLoginValues: (state, action) => {
      state.id = action.payload._id;
      state.userEmail = action.payload.email;
      state.name = action.payload.name;
      state.phone = action.payload.phone || "";
      state.location = action.payload.location || "";
      state.website = action.payload.website || "";
      state.utmSource = action.payload.utm_source || "";
      state.isActive = action.payload.isActive || false;
      state.createdBy = action.payload.createdBy || "";
      state.createdAt = action.payload.createdAt;
      state.updatedAt = action.payload.updatedAt;
      state.loginOTP = action.payload.loginOTP || "";
      state.loginOTPSentAt = action.payload.loginOTPSentAt || "";
      state.message = action.payload.message || "";
    },
  },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getUsersDetails = (state: any) => state.login;

export const { userLoginValues } = loginSlice.actions;

export default loginSlice.reducer;
