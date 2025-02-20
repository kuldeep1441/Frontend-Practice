// tabSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TabState {
    activeTab: string;
}

const initialState: TabState = {
    activeTab: ""
};

const activeTabSlice = createSlice({
    name: 'tab',
    initialState,
    reducers: {
        setActiveTab: (state, action: PayloadAction<string>) => {
            state.activeTab = action.payload;
        },
        resetTab: (state) => {
            state.activeTab = initialState.activeTab;
        }
    }
});

export const { setActiveTab, resetTab } = activeTabSlice.actions;
// Fixed selector to use correct state path and type
export const selectActiveTab = (state: any) => state.tab.activeTab;
export default activeTabSlice.reducer;
