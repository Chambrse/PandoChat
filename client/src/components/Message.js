
import React from 'react';

const Message = ({ id, msg, username, classNames, onClick }) => (
 <div className={`messages p-1 ${classNames}`} onClick={() => onClick(id)} style={{ zIndex: id, position: 'relative' }}>{`[${username}]: ${msg}`}</div>
);

export default Message; 