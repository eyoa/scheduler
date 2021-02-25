const SET_DAY = 'SET_DAY';
const SET_APP_DATA = 'SET_APP_DATA';
const SET_INTERVIEW = 'SET_INTERVIEW';

export default function reducer(state, action) {
  // if (action.type === SET_DAY) {
  //   const day = action.value;
  //   return { ...state, day };
  // }
  // if (action.type === SET_APP_DATA) {
  //   const days = [...action.days];
  //   const appointments = action.appointments;
  //   const interviewers = action.interviewers;
  //   return { ...state, days, appointments, interviewers };
  // }

  if (action.type === SET_INTERVIEW) {
    const days = action.days;
    const appointments = action.appointments;
    return { ...state, days, appointments };
  }

  throw new Error(
    `Tried to reduce with unsupported action type ${action.type}`
  );
}

export { SET_DAY, SET_APP_DATA, SET_INTERVIEW };
