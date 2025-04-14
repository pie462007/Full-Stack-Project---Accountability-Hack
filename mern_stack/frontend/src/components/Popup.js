import React from 'react'
import '../styles/Popup.css'

function Popup(props) {
  return (props.trigger) ? (
    <div className="popup">
        <div className="popup-inner">
            <button className="cancel" onClick={() => props.setTrigger(false)}>Cancel</button>
            {props.children}
        </div>
    </div>
  ) : "";
}

export default Popup