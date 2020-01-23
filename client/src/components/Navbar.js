import logo from '../images/PandoFlat_200x200.png';
import React from 'react';
import fbshare from '../images/Facebook-share-icon.png';
import twittershare from '../images/twitter-512.png';
import jsonpackage from '../../package.json';

class Navbar extends React.Component {
    constructor(props) { //<----Method
        super(props);
        this.state = { //<----Initialize state

        };
    }

    render() {  //<-----Method/Return JSX/HTML
        return (
            <nav class="navbar navbar-expand-lg navbar-dark indigo" style={{ backgroundColor: "#F0991A" }}>
                <div style={{ position: 'absolute', top: '0px', fontSize: '12px' }}>
                    alpha {jsonpackage.version}
                </div>
                <a class="navbar-brand" style={{ color: '#F3C800' }} href="/home"><img style={{ height: '64px' }} src={logo} /></a>
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText"
                    aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarText">
                    <ul class="navbar-nav mr-auto">
                        <li class="nav-item active">
                            <a class="nav-link" href="#">Home
          <span class="sr-only">(current)</span>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#">About</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#">Account</a>
                        </li>
                    </ul>
                    <span class="navbar-text white-text p-1">
                        <a href='https://www.facebook.com/sharer/sharer.php?u=https%3A//www.pando.chat'>
                            <img style={{ height: '32px' }} src={fbshare}></img>
                        </a>
                    </span>
                    <span class="navbar-text white-text p-1">
                        <a href='https://twitter.com/intent/tweet?url=https%3A%2F%2Fwww.pando.chat&text=PandoChat%20-%20Join%20the%20conversation!'>
                            <img style={{ height: '32px' }} src={twittershare}></img>
                        </a>
                    </span>
                </div>
            </nav>
        )
    }
}

export default Navbar; 