import { createSlice } from '@reduxjs/toolkit';

const DUMMY_DATA = {
	globalRanking: 10,
	localRanking: 9,
};

export const rankingSlice = createSlice({
	name: 'ranking',
	initialState: DUMMY_DATA,
	reducers: {},
});

export const {} = rankingSlice.actions;
export default rankingSlice.reducer;
