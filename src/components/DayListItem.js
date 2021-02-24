import React from "react";
import classNames from 'classnames';
import 'components/DayListItem.scss';

export default function DayListItem(props) {
  const {name, spots} = props
  let dayClass = classNames("day-list__item", {
    'day-list__item--selected' : props.selected,
    'day-list__item--full' : (props.spots === 0)
  })

  const formatSpots = function(spots){
    let display = "";
    if (spots === 0){
      display = "no spots";
    } else if (spots === 1){
      display = "1 spot"
    } 
     else {
      display = spots + " spots";
    }

    display += " remaining";
    return display
  }


  return (
    <li 
      className={dayClass} 
      onClick={() => props.setDay(name)}
      data-testid="day"
    >
      <h2 className="text--regular">{name}</h2> 
      <h3 className="text--light">{formatSpots(spots)}</h3>
    </li>
  )
}