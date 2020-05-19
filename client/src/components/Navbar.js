import logo from '../images/PandoFlat_200x200.png';
import React from 'react';
import fbshare from '../images/Facebook-share-icon.png';
import twittershare from '../images/twitter-512.png';
import jsonpackage from '../../package.json';
import { Link } from 'react-router-dom';
import { withRouter } from "react-router";
import { Dropdown, DropdownButton } from 'react-bootstrap';
import axios from 'axios';
import ErrorBoundary from './ErrorBoundary';
import { Modal } from 'react-bootstrap';


class Navbar extends React.Component {
    constructor(props) { //<----Method
        super(props);
        this.state = { //<----Initialize state
        };
        this.navHandler = this.navHandler.bind(this);
        this.logOut = this.logOut.bind(this);

    }

    // Log out
    logOut() {
        // console.log('logout running')
        axios.get('/logout').then(response => {
            this.props.updateAppState(response.data);
            // this.props.history.push("/login");
        }, { timeout: 2000 })
            .catch(() => {
                console.log("error logging out");
            });
    }

    navHandler(e) {
        console.log(e.target.getAttribute('linkto'));
        this.props.history.push(e.target.getAttribute('linkto'));
    }

    render() {  //<-----Method/Return JSX/HTML
        // console.log(this.props.history.location.pathname);
        // console.log(this.props.user.user.type);
        return (
            <nav className="navbar navbar-expand-lg navbar-dark indigo" style={{ backgroundColor: "#F0991A", zIndex: 1000 }}>
                <div style={{ position: 'absolute', top: '0px', fontSize: '12px' }}>
                    alpha {jsonpackage.version}
                </div>
                <a className="navbar-brand" style={{ color: '#F3C800' }} href="/home"><img style={{ height: '64px' }} src={logo} /></a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText"
                    aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarText">
                    <ul className="navbar-nav mr-auto">
                        <li className={"nav-item " + (this.props.history.location.pathname === '/home' ? 'active' : 'noActive')}>
                            <a className="nav-link" linkto="/home" onClick={this.navHandler} >Home
                                <span className="sr-only">(current)</span>
                            </a>
                        </li>
                        <li className={"nav-item " + (this.props.history.location.pathname === '/about' ? 'active' : 'noActive')}>
                            <div className="nav-link" linkto='/about' onClick={this.navHandler}>About
                                <span className="sr-only">(current)</span>
                            </div>
                        </li>
                        {this.props.loggedIn && this.props.user.user.type == "ADMIN" ? (
                            <li className={"nav-item " + (this.props.history.location.pathname === '/admin' ? 'active' : 'noActive')}>
                                <div className="nav-link" linkto='/admin' onClick={this.navHandler}>Admin
                                                        <span className="sr-only">(current)</span>
                                </div>
                            </li>) : null}                        {/* <li className="nav-item">
                            <a className="nav-link" href="#">Account</a>
                        </li> */}
                    </ul>
                        {!this.props.loggedIn || this.props.user === null ? (
                            <button className="btn btn-secondary m-3"><Link style={{ textDecoration: 'none', color: 'white' }} to='/login'><span id='loginButton'>Login</span></Link></button>
                        ) :
                            <div className="dropdown m-3">
                                <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    {this.props.user && this.props.user.user ? this.props.user.user.username : null}
                                </button>
                                <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                    <a className="dropdown-item" href="#">Edit Profile</a>
                                    <a className="dropdown-item" onClick={this.logOut}>Logout</a>
                                </div>
                            </div>
                        }
                    <span className="navbar-text white-text p-1">
                        <a href='https://www.facebook.com/sharer/sharer.php?u=https%3A//www.pando.chat'>
                            <img style={{ height: '32px' }} src={fbshare}></img>
                        </a>
                    </span>
                    <span className="navbar-text white-text p-1">
                        <a href='https://twitter.com/intent/tweet?url=https%3A%2F%2Fwww.pando.chat&text=PandoChat%20-%20Join%20the%20conversation!'>
                            <img style={{ height: '32px' }} src={twittershare}></img>
                        </a>
                    </span>
                </div>
            </nav>
        )
    }
}

export default withRouter(Navbar); 