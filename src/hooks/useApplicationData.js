import { useEffect, useReducer, useState, useCallback } from "react";
import axios from "axios";
import reducer, {
  SET_DAY,
  SET_APP_DATA,
  SET_INTERVIEW,
} from "../reducers/application";

export default function useApplicationData() {
  const initial = {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  };
  const [state, dispatch] = useReducer(reducer, initial);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers"),
    ]).then((response) => {
      const days = response[0].data;
      const appointments = response[1].data;
      const interviewers = response[2].data;
      dispatch({ type: SET_APP_DATA, days, appointments, interviewers });
    });
  }, []);

  const updateSpots = useCallback(
    function (appointId, updatedAppointment) {
      const day = state.days.find((entry) =>
        entry.appointments.includes(appointId)
      );

      const dayIndex = day.id - 1;
      const appArr = [...day.appointments];

      // get the appointments with our changes
      const newestAppoint = { ...state.appointments };
      newestAppoint[appointId] = updatedAppointment;

      // count the spots with that updated appointments info
      const newSpots = appArr.reduce((count, appId) => {
        if (newestAppoint[appId]["interview"] === null) {
          count += 1;
        }
        return count;
      }, 0);

      // format back into a days array to set the state
      const newday = {
        ...day,
        spots: newSpots,
      };
      const days = [...state.days];
      days[dayIndex] = newday;
      return days;
    },
    [state]
  );

  useEffect(() => {
    const ws = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);

    ws.onopen = () => {
      ws.send("ping");
    };

    setSocket(ws);
  }, []);

  useEffect(() => {
    if (socket) {
      socket.onmessage = (event) => {
        const wsData = JSON.parse(event.data);
        if (wsData.type === SET_INTERVIEW) {
          const id = wsData.id;
          const interview = wsData.interview;

          const { appointments } = formatAppointmentsChange(id, interview);

          const days = updateSpots(id, appointments);
          dispatch({ type: SET_INTERVIEW, days, appointments });
        }
      };
    }
  }, [socket, updateSpots]);

  const setDay = function (day) {
    dispatch({ type: SET_DAY, value: day });
  };

  function formatAppointmentsChange(id, interview = null) {
    const result = { appointment: {}, appointments: {} };
    if (interview) {
      result.appointment = {
        ...state.appointments[id],
        interview: { ...interview },
      };
    } else {
      result.appointment = {
        ...state.appointments[id],
        interview: null,
      };
    }

    result.appointments = {
      ...state.appointments,
      [id]: result.appointment,
    };
    console.log(result);
    return result;
  }

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
    const { appointments } = formatAppointmentsChange(id);

    return axios.delete(`/api/appointments/${id}`).then((response) => {
      if (response.status === 204) {
        const days = updateSpots(id, appointments);
        dispatch({ type: SET_INTERVIEW, days, appointments });
      }
    });
  }

  return { state, setDay, bookInterview, cancelInterview };
}
