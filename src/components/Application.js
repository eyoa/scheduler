import React from "react";
import "components/Application.scss";
import DayList from 'components/DayList';
import Appointment from 'components/Appointment/index';
import {getAppointmentsForDay, getInterviewersForDay, getInterview} from 'helpers/selectors';
import useApplicationData from '../hooks/useApplicationData'



export default function Application(props) { 
  const {
    state,
    setDay,
    bookInterview,
    cancelInterview,
    updateSpots
  } = useApplicationData();
  
  console.log("re-renders and state check in application", state);
  const dailyAppointments = getAppointmentsForDay(state, state.day);
  const interviewers = getInterviewersForDay(state, state.day);
 
  
  const schedule = dailyAppointments.map(appointment => {
    const interview = getInterview(state, appointment.interview);
    console.log();
    return (
      <Appointment 
        key={appointment.id} 
        id={appointment.id}
        time={appointment.time}
        interview={interview} 
        interviewers={[...interviewers]}
        bookInterview={bookInterview}
        cancelInterview={cancelInterview}
        updateSpots={updateSpots}
      />
    )
  })

  // To mark the end the day 
  schedule.push(<Appointment id="last" time="5pm" />)

  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList
            days={state.days}
            day={state.day}
            setDay={setDay}
          />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />

      </section>
      <section className="schedule">
        {schedule}
      </section>
    </main>
  );
}
