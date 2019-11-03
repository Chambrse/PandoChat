import React, { Component } from "react";
import { Redirect, Link } from 'react-router-dom';
import logo from '../images/Chatter_Logo_Transparent.png';
import axios from 'axios';
import "../css/login.css"
import { withRouter } from "react-router";



class Login extends Component {
    constructor() {
        super();

        this.state = {
            email: '',
            emailErrors: [],
            password: '',
            passwordErrors: [],
            redirectTo: null,
            authError: false,
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    };

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value,
        });
    };

    handleSubmit(event) {
        event.preventDefault();
        axios.post('/login', this.state).then(response => {
            this.setState(response.data);

            if (response.data.loggedIn) {
                this.props.updateAppState(response.data);
                this.props.history.push("/home");
            }

        }).catch(err => {
            console.log(err);
            this.setState({ authError: true })
        });
    }


    // componentWillReceiveProps(nextProps) {
    //     console.log(nextProps.location);
    //     console.log(this.props.location);
    // }

    render() {
        console.log("login render");
        // if (this.props.loggedIn) { return <Redirect push to='/home' /> }
        return (
            <div className='centeredAbsolute' style={{ position: "absolute" }}>
                <div className='row' id='whiteWindow'>
                    <div className='col'>
                        <div className='row justify-content-center'>
                            <img alt='chatter logo' src={logo}></img>
                        </div>
                        <div className='row p-2 d-flex justify-content-center text-center align-middle'>
                            Welcome to Chatter! The chat room for everyone. To join in the conversation, please sign up.
                                <p>New here? <Link to='/register'>Register</Link></p>
                        </div>
                        <div className='row'>
                            <div className='col-md-6 col-sm-12' style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                                <a href="http://localhost:3001/auth/facebook">
                                    <button class="loginBtn loginBtn--facebook">
                                        Login with Facebook
                                </button>
                                </a>
                                Or
                                <a href="http://localhost:3001/auth/facebook">
                                    <button class="loginBtn loginBtn--google">
                                        Login with Google
                                </button>
                                </a>
                            </div>
                            <div className='col-md-6 col-sm-12'>
                                <h2>Log In:</h2>
                                <br></br>
                                <form onSubmit={this.handleSubmit}>
                                    <div className='form-group'>
                                        <label>
                                            Email:
                                            </label>
                                        <input type="text" name='email' className={`form-control ${this.state.emailErrors.length > 0 ? 'is-invalid' : 'is-valid'}`} value={this.state.email} onChange={this.handleChange} />
                                        {this.state.emailErrors.length > 0 ? (
                                            this.state.emailErrors.map((element, index) => (
                                                <div key={index} className='invalid-feedback'>
                                                    {element}
                                                </div>
                                            ))
                                        ) : null}
                                    </div>
                                    <div className='form-group'>
                                        <label>
                                            Password:
                                </label>
                                        <input type="password" name='password' className={`form-control ${this.state.passwordErrors.length > 0 ? 'is-invalid' : 'is-valid'}`} value={this.state.password} onChange={this.handleChange} />
                                        {this.state.passwordErrors.length > 0 ? (
                                            this.state.passwordErrors.map((element, index) => (
                                                <div key={index} className='invalid-feedback'>
                                                    {element}
                                                </div>
                                            ))
                                        ) : null}
                                    </div>
                                    <br></br>
                                    <div className='form-group'>
                                        <input className='form-control btn btn-secondary' type="submit" value="Submit" />
                                        {this.state.authError ? (
                                            <div className='p-2' style={{ color: 'red' }}>
                                                Email or Password incorrect.
                                        </div>
                                        ) : null}
                                    </div>
                                </form>
                                <a href="/auth/facebook">Login with Facebook</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Login);