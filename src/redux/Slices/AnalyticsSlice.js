import { createSlice } from '@reduxjs/toolkit';

const DUMMY_DATA = [
	{
		key: 'Min Active frame class',
		value: 1,
	},
	{
		key: 'Max Active frame class',
		value: 9,
	},
	{
		key: 'Mean Active frame class',
		value: 7,
	},
	{
		key: 'Mode Active frame class',
		value: 6,
	},
];

export const analyticsSlice = createSlice({
	name: 'analytics',
	initialState: {
		data: DUMMY_DATA,
	},
	reducers: {},
});

export const {} = analyticsSlice.actions;
export default analyticsSlice.reducer;
