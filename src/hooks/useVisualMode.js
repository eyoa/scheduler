import {useState} from 'react'

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  function transition(mode, replace = false){
    if(replace){
      history.pop();
    }
    setHistory([...history, mode]);
    setMode(mode);
  }
  function back(){
    if (history.length > 1){
      const previous = history.pop();
      setMode(history[history.length-1])      
    }
  }

  return {mode, transition, back};
}