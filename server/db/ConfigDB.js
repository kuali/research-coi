let mockDB = {
	'UIT': {
		colors: {
			"one": "#348FF7",
			"two": "#0E4BB6",
			"three": "#348FF7",
			"four": "#EDF2F2"
		}
	}
};

export let getConfigFor = school => {
	return mockDB[school.toUpperCase()];
};

export let setConfigFor = (school, newConfig) => {
	mockDB[school.toUpperCase()] = newConfig;
};