import { createSlice } from '@reduxjs/toolkit';

interface FunnelState {
  isOpen: boolean;
}

const initialState: FunnelState = {
  isOpen: false,
};

const funnelSlice = createSlice({
  name: 'funnel',
  initialState,
  reducers: {
    toggleFunnel: (state) => {
      state.isOpen = !state.isOpen;
    },
  },
});

export const { toggleFunnel } = funnelSlice.actions;

export const getFunnelState = (state: any) => state.funnel.isOpen;

export default funnelSlice.reducer;
