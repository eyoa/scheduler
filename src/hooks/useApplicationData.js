import { useEffect, useReducer, useState, useCallback } from 'react';
import axios from 'axios';
import reducer, {
  SET_DAY,
  SET_APP_DATA,
  SET_INTERVIEW
} from '../reducers/application';

export default function useApplicationData() {
  const initial = {
    day: 'Monday',
    days: [],
    appointments: {},
    interviewers: {}
  };
  const [state, dispatch] = useReducer(reducer, initial);
  const [socket, setSocket] = useState(null);

  // Grab info from database and put it in the state
  useEffect(() => {
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers')
    ]).then(([days, appointments, interviewers]) => {
      dispatch({
        type: SET_APP_DATA,
        days: days.data,
        appointments: appointments.data,
        interviewers: interviewers.data
      });
    });
  }, []);

  // updateSpots count used by websockets
  const updateSpots = useCallback(
    function (appointId, updatedAppointment) {
      const day = state.days.find((entry) =>
        entry.appointments.includes(appointId)
      );

      const dayIndex = day.id - 1;
      const newAppointmentsArray = [...day.appointments];

      // get the appointments with our changes
      const newestAppoint = { ...state.appointments };
      newestAppoint[appointId] = updatedAppointment;

      // count the spots with that updated appointments info
      const newSpots = newAppointmentsArray.reduce((count, appId) => {
        if (newestAppoint[appId]['interview'] === null) {
          count += 1;
        }
        return count;
      }, 0);

      // format back into a days array to set the state
      const newday = {
        ...day,
        spots: newSpots
      };

      const days = [...state.days];
      days[dayIndex] = newday;
      return days;
    },
    [state]
  );

  // helper for updating the interview information and formatting for easy state update
  const formatAppointmentsChange = useCallback(
    function (id, interview = null) {
      const result = { appointment: {}, appointments: {} };

      result.appointment = {
        ...state.appointments[id],
        interview: interview ? { ...interview } : null
      };

      result.appointments = {
        ...state.appointments,
        [id]: result.appointment
      };
      return result;
    },
    [state]
  );

  // establish websocket connection
  useEffect(() => {
    const ws = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);

    ws.onopen = () => {
      ws.send('ping');
    };

    setSocket(ws);
    return () => {
      ws.close();
    };
  }, []);

  // the websocket listener
  useEffect(() => {
    if (socket) {
      socket.onmessage = (event) => {
        const wsData = JSON.parse(event.data);
        if (wsData.type === SET_INTERVIEW) {
          const id = wsData.id;
          const interview = wsData.interview;

          const { appointment, appointments } = formatAppointmentsChange(
            id,
            interview
          );

          const days = updateSpots(id, appointment);
          dispatch({ type: SET_INTERVIEW, days, appointments });
        }
      };
    }
  }, [socket, updateSpots, formatAppointmentsChange]);

  const setDay = function (day) {
    dispatch({ type: SET_DAY, value: day });
  };

  function bookInterview(id, interview) {
    const { appointment, appointments } = formatAppointmentsChange(
      id,
      interview
    );

    return axios
      .put(`/api/appointments/${id}`, appointment)
      .then((response) => {
        if (response.status === 204) {
          const days = updateSpots(id, appointment);
          dispatch({ type: SET_INTERVIEW, days, appointments });
        }
      });
  }

  function cancelInterview(id) {
    const { appointment, appointments } = formatAppointmentsChange(id);

    return axios.delete(`/api/appointments/${id}`).then((response) => {
      if (response.status === 204) {
        const days = updateSpots(id, appointment);
        dispatch({ type: SET_INTERVIEW, days, appointments });
      }
    });
  }

  return { state, setDay, bookInterview, cancelInterview };
}
