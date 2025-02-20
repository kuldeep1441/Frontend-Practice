import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LeadsData } from '@/interfaces/IGETLeadsDataResponse';

interface PrevFilteredLeadsState {
    leads: LeadsData[];
}

const initialState: PrevFilteredLeadsState = {
    leads: [],
};

const prevFilteredLeadsSlice = createSlice({
    name: 'prevFilteredLeads', // Corrected slice name to match convention
    initialState,
    reducers: {
        setPrevFilteredLeads(
            state,
            action: PayloadAction<LeadsData[] | ((prevLeads: LeadsData[]) => LeadsData[])>
        ) {
            if (typeof action.payload === 'function') {
                state.leads = action.payload(state.leads); // Update state using functional payload
            } else {
                state.leads = action.payload; // Update state directly with payload
            }
        },
        resetPrevFilteredLeads(state) {
            state.leads = []; // Reset leads to an empty array
        },
    },
});

// Export actions for use in dispatch
export const { setPrevFilteredLeads, resetPrevFilteredLeads } = prevFilteredLeadsSlice.actions;

// Corrected selector for type-safe access to the state
export const selectPrevFilteredLeads = (state: { prevFilteredLeads: PrevFilteredLeadsState }) =>
    state.prevFilteredLeads.leads;

// Export the reducer for use in the store
export default prevFilteredLeadsSlice.reducer;
