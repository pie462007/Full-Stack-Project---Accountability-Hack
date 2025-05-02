import React from 'react'

export default function UserBoardProfile( {userHabitData} ){
    return(
        <div id="profile">
            {Item(userHabitData)}
        </div>
    )
}

const Item = async (data) => {
    return(
        <>
        {
            data.map((value, index) => (
                <div className="flex" key={index}>
                    <div className="profile">
                        <div className="info">
                            <h3 className="Email">{value.email}</h3>
                        </div>
                    </div>
                    <div className="Streak">
                        <span>{value.longestCurrent}</span>
                    </div>
                </div>
                )
            )
        }
        </>
    )
}