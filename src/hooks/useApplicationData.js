import {useState, useEffect, useReducer} from 'react';
import axios from 'axios';

export default function useApplicationData() {

  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });



  useEffect(() => {
    Promise.all([axios.get('/api/days'), axios.get('/api/appointments'), axios.get('api/interviewers')])
    .then((response) => {
      setState(prev => ({...prev, days: response[0].data, appointments: response[1].data, interviewers: response[2].data}))
    })
    
  },[])


  const setDay = function(day){
    setState({...state, day})
  }

  const updateSpots = function(change){
    const [dayArr] = state.days.filter(entry => entry.name === state.day)
    const dayIndex = dayArr.id - 1;
    let newSpots; 

    if (change === "add"){
      newSpots = dayArr.spots + 1;
    }else if (change === "remove"){
      newSpots = dayArr.spots - 1;
    }
    const newday = {
      ...dayArr,
      spots: newSpots
    } 
    const days = [...state.days]
    days[dayIndex] = newday;

    return days
  }

  
  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: {...interview}
    }
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    return axios.put(`/api/appointments/${id}`, {interview})
    .then(response => {
      if(response.status === 204){
        const days = updateSpots("remove");
        
        setState({...state, days, appointments})
      }
    })
  }

  function cancelInterview(id) {
    
    const appointment = {
      ...state.appointments[id],
      interview: null
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    return axios.delete(`/api/appointments/${id}`)
    .then (response => {
      if (response.status === 204){
        const days = updateSpots("add");
        setState({...state, days, appointments})
      }
    })
  }

  return {state, setDay, bookInterview, cancelInterview, updateSpots}
}