import { createSlice } from '@reduxjs/toolkit';

const DUMMY_DATA = {
	names: ['Area Code', 'Location Code', 'Total Bee Hives', 'Total Frames'],
	data: [
		['01', '1234', 56, 56],
		['02', '1234', 56, 56],
		['03', '1234', 56, 56],
		['04', '1234', 56, 56],
		['05', '1234', 56, 56],
		['06', '1234', 56, 56],
		['07', '1234', 56, 56],
		['08', '1234', 56, 56],
		['09', '1234', 56, 56],
		['10', '1234', 56, 56],
	],
};

export const beeHiveFormSlice = createSlice({
	name: 'beeHiveForm',
	initialState: {
		data: DUMMY_DATA,
		selectedRow: null,
		maxRows: 4,
		page: 1,
	},
	reducers: {
		updateSelectedRow: (state, action) => {
			state.selectedRow = action.payload;
		},
		updatePage: (state, action) => {
			state.page = action.payload;
			state.selectedRow = null;
		},
	},
});

export const { updateSelectedRow, updatePage } = beeHiveFormSlice.actions;
export default beeHiveFormSlice.reducer;
