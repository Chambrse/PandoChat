import React from 'react';

import leaves from '../images/leavesFalling.gif'

const Loading = () => (
    <div className='container-fluid'>
        <div className='row'>
            <div className='col'>
                <div className='mx-auto' style={{ backgroundColor: 'white', position: 'absolute'}}>
                    <h1>
                        Loading
                    </h1>
                </div>
                <img style={{
                    width: '100%',
                    height: '100%'
                }} src={leaves}></img>
            </div>
        </div>
    </div>
);

export default Loading;
