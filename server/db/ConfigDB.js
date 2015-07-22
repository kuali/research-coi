let mockDB = {
  'UIT': {
    colors: {
      "one": "#348FF7",
      "two": "#0E4BB6",
      "three": "#348FF7",
      "four": "#EDF2F2"
    },
    "instructions": {
      "questionnaire": "For each question that is presented, choose the most appropriate answer. As you select answers the questionnaire will progress to the next step.",
      "questionnairesummary": "Review your answers here. If an answer is wrong click edit and change your answer. Once all answers are correct, proceed to the next step.",
      "entities": "Here you can add new financial entities and review existing ones. If an entity no longer applies click 'Deactivate'.",
      "projects": "On this step you can review each of your projects and disclose if any of your financial entities have a conflict of interest with the project.",
      "manual": "Manual instructions go here",
      "certify": "Please read the certification text. If you agree with the statement, check the box and click 'Certify'"
    },
    "questions": [
      {
        "id": 1,
        "text": "From any for-profit organization, did you receive in the last 12 months, or do you expect to receive in the next 12 months, salary, director's fees, consulting payments, honoraria, royalties; or other payments for patents, copyrights or other intellectual property; or other direct payments exceeding $5,000?",
        "yes": 2,
        "no": 2
      },
      {
        "id": 2,
        "text": "From any privately held organization, do you have stock, stock options, or other equity interest of any value?",
        "yes": 3,
        "no": 3
      },
      {
        "id": 3,
        "text": "Some publicly traded stock must be disclosed, but only in specific circumstances. Do you own stock, which in aggregate exceeds $5,000, in a company that provides funds to this institution in support of your Institutional Responsibilities (e.g. teaching, research, committee, or other administrative responsibilities)? When aggregating, please consider stock, stock options, warrants and other existing or contingent ownership interests in the publicly held company. Do not consider investments where you do not directly influence investment decisions, such as mutual funds and retirement accounts.",
        "yes": 4,
        "no": 4
      },
      {
        "id": 4,
        "text": "From US educational institutions, US teaching hospitals or US research institutions affiliated with US educational institutions: Did you receive in the last 12 months, or do you expect to receive in the next 12 months, payments for services, which in aggregate exceed $5,000 (e.g. payments for consulting, board positions, patents, copyrights or other intellectual property)? Exclude payments for scholarly or academic works (i.e. peer-reviewed (vs. editorial reviewed) articles or books based on original research or experimentation, published by an academic association or a university/academic press).",
        "yes": -1,
        "no": -1
      }
    ]
  }
};

export let getConfig = (req) => {
  return mockDB['UIT'];
};

export let setConfig = (req) => {
  mockDB['UIT'] = req.body;
};