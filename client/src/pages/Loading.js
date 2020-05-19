import React from 'react';

import leaves from '../images/leavesFalling.gif';
import loading from '../images/loading.svg';

const Loading = () => (
    <div className='container'>
        <div className='row'>
            <div className='col'>
                {/* <div className='row justify-content-center'> */}
                    <div className='justify-content-center d-flex'>
                        <img style={{
                            width: '50%',
                            height: '50%'
                        }} src={loading}></img>
                    </div>
                {/* </div> */}
            </div>
        </div>
    </div>
);

export default Loading;
