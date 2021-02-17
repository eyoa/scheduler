import React, {useState, useEffect} from "react";
import axios from 'axios';
import "components/Application.scss";
import DayList from 'components/DayList';
import Appointment from 'components/Appointment/index';

const appointments = [
  {
    id: 1,
    time: "12pm",
  },
  {
    id: 2,
    time: "1pm",
    interview: {
      student: "Lydia Miller-Jones",
      interviewer: {
        id: 1,
        name: "Sylvia Palmer",
        avatar: "https://i.imgur.com/LpaY82x.png",
      }
    }
  },
  {
    id: 3,
    time: "3pm",
  },
  {
    id: 4,
    time: "3pm",
  },
  {
    id: 5,
    time: "4pm",
    interview: {
      student: "Spongebob",
      interviewer: {
        id: 1,
        name: "Sven Jones",
        avatar: "https://i.imgur.com/twYrpay.jpg",
      }
    }
  },
  {
    id: "last",
    time: "5pm",
  }
];


export default function Application(props) {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {}
  });

  useEffect(() => {
    axios.get('/api/days')
    .then(response =>{
      setDays(response.data);
    })
  },[])


  const setDays = function(days){
    setState(prev => ({...prev, days}));
  }

  const setDay = function(day){
    setState({...state, day});
  }


  const parsedAppointment = appointments.map(appointment => {
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
