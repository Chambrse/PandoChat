import React, { Component } from "react";
import { Redirect, Link } from 'react-router-dom';
import logo from '../images/Chatter_Logo_Transparent.png';
import axios from 'axios';


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
        axios.post('/login', this.state).then(response => {
            this.setState(response.data);

            if (response.data.loggedIn) {
                this.props.updateAppState(response.data);
            }

        }).catch(err => {
            console.log(err);
            this.setState({ authError: true })
        });
        event.preventDefault();
    }

    render() {
        if (this.props.loggedIn) { return <Redirect to='/' /> }
        return (
                <div style={{ position: 'absolute' }} >
                    <div className='row' id='whiteWindow'>
                        <div className='col'>
                            <div className='row justify-content-center'>
                                <img alt='chatter logo' src={logo}></img>
                            </div>
                            <div className='row'>
                                <div className='col text-center align-middle p-2'>
                                    Welcome to Chatter! The chat room for everyone. To join in the conversation, please sign up.
                                <p>New here? <Link to='/register'>Register</Link></p>
                                </div>
                                <div className='col'>
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
                                            <input type="text" name='password' className={`form-control ${this.state.passwordErrors.length > 0 ? 'is-invalid' : 'is-valid'}`} value={this.state.password} onChange={this.handleChange} />
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
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        )
    }
}

export default Login;