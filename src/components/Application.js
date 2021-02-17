import React, {useState, useEffect} from "react";
import axios from 'axios';
import "components/Application.scss";
import DayList from 'components/DayList';
import Appointment from 'components/Appointment/index';
import {getAppointmentsForDay} from 'helpers/selectors';

export default function Application(props) {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {}
  });

  useEffect(() => {
    Promise.all([axios.get('/api/days'), axios.get('/api/appointments')])
    .then((response) => {
      setState(prev => ({...prev, days: response[0].data, appointments: response[1].data}))
    })
    
  },[])

  useEffect(() => {
    axios.get('/api/appointments')

  })



  const setDay = function(day){
    setState({...state, day});
  }

  const dailyAppointments = getAppointmentsForDay(state, state.day);

  const parsedAppointment = dailyAppointments.map(appointment => {
    return <Appointment key={appointment.id} {...appointment}/>
  })

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
        {parsedAppointment}
      </section>
    </main>
  );
}
