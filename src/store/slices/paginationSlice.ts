import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// import { SearchableFields } from '@/enums/SearchableFields';
// import { SortOrderType } from '@/enums/SortOrderType';
import { IPaginationConfig } from '@/types/IPaginationConfig';

interface PaginationState {
    config: IPaginationConfig;
}

const initialState: PaginationState = {
    config: {
        currentPage: 1,
        limit: 10,
        // sort: SearchableFields.createdAt,
        // sortOrder: SortOrderType.DESC,
        isReady: false,
    },
};

const paginationSlice = createSlice({
    name: 'pagination',
    initialState,
    reducers: {
        setPagination: (state, action: PayloadAction<Partial<IPaginationConfig>>) => {
            state.config = {
                ...state.config,
                ...action.payload
            };
        },
        setLastPagination: (state, action: PayloadAction<Partial<IPaginationConfig>>) => {
          state.config = {
              ...state.config,
              ...action.payload
          };
      },
    }
});

export const { setPagination } = paginationSlice.actions;
export const selectPaginationConfig = (state: any) => state.pagination.config;
export default paginationSlice.reducer;
