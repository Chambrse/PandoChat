
import React from 'react';
import fbshare from '../images/Facebook-share-icon.png';

class Navbar extends React.Component {
    constructor(props) { //<----Method
        super(props);
        this.state = { //<----Initialize state

        };
    }



    render() {  //<-----Method/Return JSX/HTML
        return (
            <nav class="navbar navbar-expand-lg navbar-dark indigo" style={{ backgroundColor: "#F0991A"}}>
                <a class="navbar-brand" style={{color:'#F3C800'}}href="/home">Pando</a>
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
                    <span class="navbar-text white-text">
                        <a href='https://www.facebook.com/sharer/sharer.php?u=https%3A//www.pando.chat'>
                            <img style={{height: '32px'}}src={fbshare}></img>
                        </a>
    </span>
                </div>
            </nav>
        )
    }
}

export default Navbar; 