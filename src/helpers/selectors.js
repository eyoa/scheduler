
export function getAppointmentsForDay (state, day){
  const appointmentsForDay = [];
  const selectedDay = state.days.filter(entry => entry.name === day);

  if (selectedDay.length > 0){
    for (const id of selectedDay[0].appointments){
      appointmentsForDay.push(state.appointments[id]);
    }
  }

  return appointmentsForDay;
}