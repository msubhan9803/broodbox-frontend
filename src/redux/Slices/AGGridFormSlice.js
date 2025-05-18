import { createSlice } from '@reduxjs/toolkit';

const generateData = (rows) => {
	let data = [];

	for (let i = 0; i < rows; i++) {
		data.push({
			'Area Code': Math.floor(Math.random() * 10 + 1).toString(),
			'Location Code': Math.floor(Math.random() * 10 + 1).toString(),
			'Active frame 00 hives': Math.floor(Math.random() * 10 + 1).toString(),
			'Active frame 02 hives': Math.floor(Math.random() * 10 + 1).toString(),
			'Active frame 04 hives': Math.floor(Math.random() * 10 + 1).toString(),
			'Active frame 06 hives': Math.floor(Math.random() * 10 + 1).toString(),
			'Active frame 08 hives': Math.floor(Math.random() * 10 + 1).toString(),
		});
	}

	return data;
};

const DUMMY_DATA = {
	names: [
		{
			field: 'Area Code',
			rowDrag: true,
			filter: 'agTextColumnFilter',
			floatingFilter: true,
		},
		{
			field: 'Location Code',
			filter: 'agTextColumnFilter',
			floatingFilter: true,
		},
		{
			field: 'Active frame 00 hives',
			filter: 'agTextColumnFilter',
			floatingFilter: true,
		},
		{
			field: 'Active frame 02 hives',
			filter: 'agTextColumnFilter',
			floatingFilter: true,
		},
		{
			field: 'Active frame 04 hives',
			filter: 'agTextColumnFilter',
			floatingFilter: true,
		},
		{
			field: 'Active frame 06 hives',
			filter: 'agTextColumnFilter',
			floatingFilter: true,
		},
		{
			field: 'Active frame 08 hives',
			filter: 'agTextColumnFilter',
			floatingFilter: true,
		},
	],
	data: generateData(100, 7),
};

export const agGridFormSlice = createSlice({
	name: 'agGridForm',
	initialState: {
		data: DUMMY_DATA,
		selectedRow: null,
		stats: {
			rows: DUMMY_DATA.data.length,
			average: 100,
			count: 100,
			min: 100,
			max: 100,
			sum: 100,
		},
	},
	reducers: {
		updateSelectedRow: (state, action) => {
			state.selectedRow = action.payload;
		},
	},
});

export const { updateSelectedRow } = agGridFormSlice.actions;
export default agGridFormSlice.reducer;
