export function getAppointmentsForDay(state, day) {
  let appointmentsForDay = [];
  const selectedDay = state.days.filter((entry) => entry.name === day);

  if (selectedDay.length > 0) {
    appointmentsForDay = selectedDay[0].appointments.map(
      (appointId) => state.appointments[appointId]
    );
  }

  return appointmentsForDay;
}

export function getInterview(state, interview) {
  let interviewObj = null;
  if (interview) {
    const interviewer = state.interviewers[interview.interviewer];
    interviewObj = { ...interview, interviewer };
  }
  return interviewObj;
}

export function getInterviewersForDay(state, day) {
  let interviewersForDay = [];
  const selectedDay = state.days.filter((entry) => entry.name === day);

  if (selectedDay.length > 0) {
    interviewersForDay = selectedDay[0].interviewers.map(
      (id) => state.interviewers[id]
    );
  }

  return interviewersForDay;
}
