export function sortQuestions(questions) {
  return questions.sort((q1, q2) => {
    let q1sortId = q1.parent ? q1.parent : q1.id;
    let q2sortId = q2.parent ? q2.parent : q2.id;
    let retVal = q1sortId - q2sortId;
    if (retVal === 0) {
      retVal = q1.id - q2.id;
    }
    return retVal;
  });
}
