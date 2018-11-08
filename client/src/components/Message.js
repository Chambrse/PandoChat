
import React from 'react';

const Message = ({ id, msg, username }) => (
 <div className='message p-1'>{`[${username}]: ${msg}`}</div>
);

export default Message;