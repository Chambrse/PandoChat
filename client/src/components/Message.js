
import React from 'react';

const Message = ({ id, msg, username }) => (
 <div className='messages p-1' style={{ zIndex: id, position: 'relative' }}>{`[${username}]: ${msg}`}</div>
);

export default Message; 