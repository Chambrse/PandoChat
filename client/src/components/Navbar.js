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
            email: '',
            emailErrors: [],
            password: '',
            passwordErrors: [],
            redirectTo: null,
            authError: false
        };
        this.navHandler = this.navHandler.bind(this);
        this.logOut = this.logOut.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }

    handleSubmit(event) {
        event.preventDefault();
        this.setState({authError: false}, () => {
            axios.post('/login', this.state).then(response => {
                this.setState(response.data);
                console.log(response);
    
                if (response.data.loggedIn) {
                    this.props.updateAppState(response.data);
                    this.props.socket.disconnect();
                    this.props.socket.connect();
                    this.props.socket.emit("socket-login");
                    console.log(this.props.history);
                    if (this.props.history[-1] != '/home') {
                        this.props.history.push("/home");
                    }
                }
    
            }).catch(err => {
                console.log(err);
                this.setState({ authError: true })
            });
        });
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value,
        });
    };

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
                        <li className={"nav-item " + (this.props.history.location.pathname === '/tutorial' ? 'active' : 'noActive')}>
                            <div className="nav-link" linkto='/tutorial' onClick={this.navHandler}>Tutorial
                                <span className="sr-only">(current)</span>
                            </div>
                        </li>
                        {this.props.loggedIn && this.props.user.user.type == "ADMIN" ? (
                            <li className={"nav-item " + (this.props.history.location.pathname === '/admin' ? 'active' : 'noActive')}>
                                <div className="nav-link" linkto='/admin' onClick={this.navHandler}>Admin
                                                        <span className="sr-only">(current)</span>
                                </div>
                            </li>) : null}
                        {/* <li className="nav-item">
                            <a className="nav-link" href="#">Account</a>
                        </li> */}
                    </ul>
                    {!this.props.loggedIn || this.props.user === null ? (
                        <div className='d-flex'>
                            <form class="form-inline" onSubmit={this.handleSubmit}>
                                <div className='form-group loginInput'>
                                    <input type="text" name='email' placeholder='Email' className={`form-control ${this.state.emailErrors.length > 0 ? 'is-invalid' : 'is-valid'}`} value={this.state.email} onChange={this.handleChange} />
                                    {this.state.emailErrors.length > 0 ? (
                                        this.state.emailErrors.map((element, index) => (
                                            <div key={index} className='invalid-feedback'>
                                                {element}
                                            </div>
                                        ))
                                    ) : null}
                                </div>
                                <div className='form-group loginInput'>
                                    <input type="password" name='password' placeholder='Password' className={`form-control ${this.state.passwordErrors.length > 0 ? 'is-invalid' : 'is-valid'}`} value={this.state.password} onChange={this.handleChange} />
                                    {this.state.passwordErrors.length > 0 ? (
                                        this.state.passwordErrors.map((element, index) => (
                                            <div key={index} className='invalid-feedback'>
                                                {element}
                                            </div>
                                        ))
                                    ) : null}
                                </div>
                                <br></br>
                                <div className='form-group loginInput'>
                                    <input className='form-control btn btn-secondary' type="submit" value="Login" />
                                    {this.state.authError ? (
                                        <div className='p-2' style={{ color: 'red' }}>
                                            Email or Password incorrect.
                                        </div>
                                    ) : null}
                                </div>
                            </form>
                            <Link to='/register'><button className='btn btn-secondary'>Register</button></Link>
                            
                            
                        </div>
                    ) :
                        <div className="dropdown m-3">
                            <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                {this.props.user && this.props.user.user ? this.props.user.user.username : null}
                            </button>
                            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                {/* <a className="dropdown-item" href="#">Edit Profile</a> */}
                                <a className="dropdown-item" onClick={this.logOut}>Logout</a>
                            </div>
                        </div>
                    }
                    <span className="navbar-text white-text p-1">
                        <a href='https://www.facebook.com/sharer/sharer.php?u=https%3A//www.pando.chat'>
                            <i class="fa fa-facebook-square fa-lg"></i>
                        </a>
                    </span>
                    <span className="navbar-text white-text p-1">
                        <a href='https://twitter.com/intent/tweet?url=https%3A%2F%2Fwww.pando.chat&text=PandoChat%20-%20Join%20the%20conversation!'>
                        <i class="fa fa-twitter-square fa-lg"></i>
                        </a>
                    </span>
                </div>
            </nav>
        )
    }
}

export default withRouter(Navbar); 