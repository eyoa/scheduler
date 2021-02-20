import {useEffect, useReducer} from 'react';
import axios from 'axios';

const SET_DAY = "SET_DAY";
const SET_APP_DATA = "SET_APP_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";


const reducer = (state, action) => {
  if (action.type === SET_DAY){
    const day = action.value;
    return {...state, day}
  }
  if (action.type === SET_APP_DATA){
    console.log(action);
    const days = action.days;
    const appointments = action.appointments;
    const interviewers = action.interviewers;
    console.log("state setting app data", state);
    return {...state, days, appointments, interviewers}
  }

  if (action.type === SET_INTERVIEW){
    const days = action.days;
    const appointments = action.appointments;
    return {...state, days, appointments}
  }
  return state;
}

export default function useApplicationData() {
  const initial = {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  }
  const [state, dispatch] = useReducer(reducer, initial);


  useEffect(() => {
    Promise.all([axios.get('/api/days'), axios.get('/api/appointments'), axios.get('api/interviewers')])
    .then((response) => {
      const days = response[0].data;
      const appointments = response[1].data;
      const interviewers = response[2].data;
      dispatch({type: SET_APP_DATA, days, appointments, interviewers})
    })
    
  },[])


  const setDay = function(day){
    dispatch({type: SET_DAY, value: day})
  }

  const updateSpots = function(appointId, appointment){
    // get the specific day array to update the spots number in
    const [dayArr] = state.days.filter(entry => entry.name === state.day)
    const dayIndex = dayArr.id - 1;
    const appArr = [...dayArr.appointments]  

    // get the appointments with our changes
    const newestAppoint = {...state.appointments}
    newestAppoint[appointId] = appointment

    // count the spots with that updated appointments info
    const newSpots = appArr.reduce((count, appId) => {
      if (newestAppoint[appId]["interview"] !== null){
        count -= 1;
      }
      return count;
    }, 5)
    
    // format back into a days array to set the state
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

    return axios.put(`/api/appointments/${id}`, appointment)
    .then(response => {
      if(response.status === 204){
        const days = updateSpots(id, appointment);
        dispatch({type: SET_INTERVIEW, days, appointments})
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
        const days = updateSpots(id, appointment);
        dispatch({type: SET_INTERVIEW, days, appointments})
      }
    })
  }

  return {state, setDay, bookInterview, cancelInterview, updateSpots}
}