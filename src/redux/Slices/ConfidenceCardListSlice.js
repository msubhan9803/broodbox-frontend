import { createSlice } from '@reduxjs/toolkit';

const generateData = (classCount) => {
	let classes = [];

	for (let i = 0; i < classCount; i++) {
		classes.push({
			classLevel: Math.floor(Math.random() * 10),
			confidence: +Math.random().toFixed(2),
			src: '/dummy_image.png',
			alt: 'dummy_image',
		});
	}

	return {
		locationRichness: +(Math.random() * 100).toFixed(2),
		classes: classes,
	};
};

const DUMMY_DATA = [
	generateData(20),
	generateData(16),
	generateData(4),
	generateData(36),
];

export const confidenceCardListSlice = createSlice({
	name: 'confidenceCardList',
	initialState: {
		locations: DUMMY_DATA,
		selectedLocation: 0,
		page: 1,
	},
	reducers: {
		updateSelectedLocation: (state, action) => {
			state.selectedLocation = action.payload;
			state.page = 1;
		},
		updatePage: (state, action) => {
			state.page = action.payload;
		},
	},
});

export const { updateSelectedLocation, updatePage } =
	confidenceCardListSlice.actions;
export default confidenceCardListSlice.reducer;
