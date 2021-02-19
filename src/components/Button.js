import React from "react";
import classNames from 'classnames'
import "components/Button.scss";

export default function Button(props) {
   const {confirm, danger} = props
   let buttonClass = classNames("button", {
      "button--confirm": confirm,
      "button--danger" : danger     
   });

   return <button 
      className={buttonClass} 
      disabled={props.disabled} 
      onClick={props.onClick}
      >
         {props.children}
      </button>;
}
