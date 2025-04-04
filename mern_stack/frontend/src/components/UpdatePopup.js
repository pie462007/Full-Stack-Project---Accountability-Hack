import React, { useState } from "react";

const Popup = ({props}) => {
    return (props.trigger) ? (
        <div className="Popup">
            <div className="Popup-inner">
                <button className="cancel" onClick={() => props.setTrigger(false)}>Cancel</button>
                { props.children }
            </div>
        </div>
    ): "";
}

export default Popup