import React from 'react'

const MessageScreen = ({messages}) => {
    return(
        <div className="messages">
            {
                messages.length>0 &&
                <ul className="list">
                <h4>Activity History</h4>
                    {messages.map((message, i) => (
                        <li key={i}>
                            {message}
                        </li>
                    ))}
                </ul>
            }
        </div>
    )
}

export default MessageScreen;