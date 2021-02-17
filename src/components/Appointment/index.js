import React from 'react';
import './styles.scss'
import Header from './Header'
import Show from './Show'
import Empty from './Empty'


export default function Appointment(props){
  // const parsedAppointment = appointments.map(appointment => {

  // })

  return (
    <article className="appointment">
      <Header time={props.time}/>
        {props.interview ? <Show {...props.interview}/>: <Empty/>}
    </article>
  )
}