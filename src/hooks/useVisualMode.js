import {useState} from 'react'

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  function transition(mode, replace = false){
    const transHistory = [...history]
    if(replace){
      transHistory.pop();
    }
    console.log(transHistory);
    setHistory([...transHistory, mode]);
    setMode(mode);
  }

  function back(){

    if (history.length > 1){
      const previous = history.slice(0, -1)
      setHistory(previous)
      setMode(previous[previous.length-1])      
    }
  }

  return {mode, transition, back};
}