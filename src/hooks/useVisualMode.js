import { useState } from 'react';

// tracks and changes the view for appointments
export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  function transition(mode, replace = false) {
    const transHistory = [...history];
    if (replace) {
      transHistory.pop();
    }
    setHistory([...transHistory, mode]);
    setMode(mode);
  }

  function back() {
    if (history.length > 1) {
      const previous = history.slice(0, -1);
      setHistory(previous);
      setMode(previous[previous.length - 1]);
    }
  }

  return { mode, transition, back };
}
