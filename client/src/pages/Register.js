import React, { Component } from "react";
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import '../css/register.css';
import logo from '../images/Chatter_Logo_Transparent.png';
import validator from 'validator';
import axios from 'axios';

class Register extends Component {
    constructor() {
        super();

        this.state = {
            username: '',
            usernameErrors: [],
            email: '',
            emailErrors: [],
            password: '',
            passwordErrors: [],
            passwordMatch: '',
            passwordMatchErrors: [],
            redirectTo: null,
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    };

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value,
        });

        const value = event.target.value;
        const newErrors = [];

        switch (event.target.name) {
            case 'username':
                if (value.length < 5 || value.length > 20) { newErrors.push('Username must be between 5 and 20 characters.') };
                this.setState({ usernameErrors: newErrors })
                break;
            case 'email':
                if (!validator.isEmail(value)) { newErrors.push('This is not a valid Email.') };
                this.setState({ emailErrors: newErrors });
                break;
            case 'password':
                if (!validator.matches(value, /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.* )(?=.*[^a-zA-Z0-9]).{8,}$/, "i")) { newErrors.push('Password must include one lowercase character, one uppercase character, a number, and a special character.') }
                if (value.length < 6) { newErrors.push('Password must be at least six characters.') };
                this.setState({ passwordErrors: newErrors })
                break;
            case 'passwordMatch':
                if (!validator.equals(value, this.state.password)) { newErrors.push('Passwords do not match.') }
                if (value.length < 6) { newErrors.push('Password must be at least six characters.') };
                this.setState({ passwordMatchErrors: newErrors })
                break;
            default:
                break;
        }
    }

    handleSubmit(event) {
        axios.post('/register', this.state).then(response => {
            this.setState(response.data);

            if (response.data.loggedIn) {
                this.props.updateAppState(response.data);
            }
        });
        event.preventDefault();
    }

    render() {
        if (this.props.loggedIn) { return <Redirect to='/home' /> }
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
                                <p>Already have an account? <Link to='/login'>Log In</Link></p>
                            </div>
                            <div className='col'>
                                <h2>Register:</h2>
                                <br></br>
                                <form onSubmit={this.handleSubmit}>
                                    <div className='form-group'>
                                        <label>
                                            Username:
                                    </label>
                                        <input type="text" name='username' className={`form-control ${this.state.usernameErrors.length > 0 ? 'is-invalid' : 'is-valid'}`} value={this.state.username} onChange={this.handleChange} />
                                        {this.state.usernameErrors.length > 0 ? (
                                            this.state.usernameErrors.map((element, index) => (
                                                <p key={index} className='errorClass'>
                                                    {element}
                                                </p>
                                            ))
                                        ) : null}
                                    </div>
                                    <div className='form-group'>
                                        <label>
                                            Email:
                                    </label>
                                        <input type="text" name='email' className={`form-control ${this.state.emailErrors.length > 0 ? 'is-invalid' : 'is-valid'}`} value={this.state.email} onChange={this.handleChange} />
                                        {this.state.emailErrors.length > 0 ? (
                                            this.state.emailErrors.map((element, index) => (
                                                <p key={index} className='errorClass'>
                                                    {element}
                                                </p>
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
                                                <p key={index} className='errorClass'>
                                                    {element}
                                                </p>
                                            ))
                                        ) : null}
                                    </div>
                                    <div className='form-group'>
                                        <label>
                                            Re-enter Password:
                                    </label>
                                        <input type="password" name='passwordMatch' className={`form-control ${this.state.passwordMatchErrors.length > 0 ? 'is-invalid' : 'is-valid'}`} value={this.state.passwordMatch} onChange={this.handleChange} />
                                        {this.state.passwordMatchErrors.length > 0 ? (
                                            this.state.passwordMatchErrors.map((element, index) => (
                                                <p key={index} className='errorClass'>
                                                    {element}
                                                </p>
                                            ))
                                        ) : null}
                                    </div>
                                    <br></br>
                                    <div className='form-group'>
                                        <input className='form-control btn btn-secondary' type="submit" value="Submit" />
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

export default Register;