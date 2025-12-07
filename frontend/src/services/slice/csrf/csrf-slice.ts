import { createSlice } from '@reduxjs/toolkit'
import { TCsrfState } from '@slices/csrf/type.ts';
import { getCsrfToken } from '@slices/csrf/thunk.ts';

const initialState: TCsrfState = {
    csrfToken:  '',
}

export const csrfSlice = createSlice({
    name: 'csrf',
    initialState,
    reducers: {
        resetCsrfToken: () => initialState,
    },
    extraReducers: (builder) => {
      builder
        .addCase(getCsrfToken.fulfilled, (state, action) => {
          state.csrfToken = action.payload.csrfToken
        })
    },
    selectors: {
        selectCsrfToken: (state: TCsrfState) => state.csrfToken,
    },
})
