let mockDB = {
	'MIT': {
		colors: {
			one: "#BADDAD",
			two: "#4DDEAD",
			three: "#FF99FF",
			four: "#2BDEAD"
		},
		questions: [
			{
				text: "Do you ever take money from strangers?",
				instructions: "Choose the answer that seems least likely to get you in trouble",
				subquestions: [
					{
						text: "In disneyland?",
						instructions: "Tell us the truth!"
					}
				]
			}
		],
		entities: {
			formbotConfig: null
		},
		strings: {
			dashboard: {
				annual_button: "Update Annual Disclosure",
				travel_button: "New Travel Disclosure",
				manual_button: "New Manual Disclosure"
			},
			disclosure: {
				questionnaire_step: "Questionnaire",
				entity_step: "Financial Entities",
				instruction_button: "Instructions",
				question_number: "Question"
			}
		}
	}
};

export let getConfigFor = school => {
	return mockDB[school];
};

export let setConfigFor = (school, newConfig) => {
	mockDB[school] = newConfig;
};