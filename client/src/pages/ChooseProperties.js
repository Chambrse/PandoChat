import React, { Component } from "react";
import '../css/register.css';
import logo from '../images/Chatter_Logo_Transparent.png';
import axios from 'axios';
import { withRouter } from "react-router";
import { SketchPicker } from 'react-color';
import Message from '../components/Message';



class ChooseProperties extends Component {
    constructor() {
        super();

        this.state = {
            color: {
                "hsl": {
                    "h": 264.935064935065,
                    "s": 0.7333,
                    "l": 0.4117,
                    "a": 0.5
                },
                "hex": "#5c1cb6",
                "rgb": {
                    "r": 92,
                    "g": 28,
                    "b": 182,
                    "a": 1
                },
                "hsv": {
                    "h": 264.935064935065,
                    "s": 0.846131656378007,
                    "v": 0.71359961,
                    "a": 0.5
                },
                "oldHue": 264.935064935065,
                "source": "rgb"
            },
            alias: undefined,
            shadow: '4px 4px 2px'
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.onColorChange = this.onColorChange.bind(this);
        this.messageClick = this.messageClick.bind(this);
    };

    messageClick(id) {
        //do nothing
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value,
        });

        // Client side, HOT input validation
        // const value = event.target.value;
        // const newErrors = [];

        // switch (event.target.name) {
        //     case 'username':
        //         if ((value.length < 5 || value.length > 20)) {
        //             newErrors.push('Username must be between 5 and 20 characters.')
        //             this.setState({ usernameErrors: ['Username must be between 5 and 20 characters.'] });
        //         } else if (this.state.usernameErrors.length > 0) {
        //             this.setState({ usernameErrors: [] })
        //         };
        //         break;
        //     case 'email':
        //         if (!validator.isEmail(value)) { newErrors.push('This is not a valid Email.') };
        //         this.setState({ emailErrors: newErrors });
        //         break;
        //     case 'password':
        //         if (!validator.matches(value, /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.* )(?=.*[^a-zA-Z0-9]).{8,}$/, "i")) { newErrors.push('Password must include one lowercase character, one uppercase character, a number, and a special character.') }
        //         if (value.length < 6) { newErrors.push('Password must be at least six characters.') };
        //         this.setState({ passwordErrors: newErrors })
        //         break;
        //     case 'passwordMatch':
        //         if (!validator.equals(value, this.state.password)) { newErrors.push('Passwords do not match.') }
        //         if (value.length < 6) { newErrors.push('Password must be at least six characters.') };
        //         this.setState({ passwordMatchErrors: newErrors })
        //         break;
        //     default:
        //         break;
        // }
    }

    handleSubmit(event) {
        axios.put('user', { color: this.state.color }).then(response => {
            // console.log(response);
            this.props.updateAppState({
                user: {user: response.data.user}
            }, () => {
                this.props.history.push("/home");
            });
        })

        event.preventDefault();
    }

    // messageClick() {

    // }

    onColorChange(color) {
        this.setState({ color: color })
    }

    render() {
        // console.log("register render");
        // if (this.props.loggedIn) { return <Redirect push to='/home' /> }
        return (
            <div className='centeredAbsolute' style={{ position: 'absolute' }}>
                <div className='row' id='whiteWindow'>
                    <div className='col p-5'>
                        <div className='row justify-content-center'>
                            <img alt='chatter logo' src={logo}></img>
                        </div>
                        <div className='row justify-content-center'>
                            Message Preview:
                        </div>
                        <br></br>
                        <div className='row justify-content-center'>
                            <Message onClick={this.messageClick}
                                classNames={'test'}
                                username={this.props.user.user.username}
                                msg={"This is what your messages will look like."}
                                animation={'slidein .25s ease'}
                                user={{ username: this.props.user.username, color: this.state.color }}
                            />
                        </div>
                        <br></br>
                        <div className='row d-flex justify-content-center'>
                            <form onSubmit={this.handleSubmit}>
                                <div className='form-group'>
                                    <div className='row justify-content-center'>
                                        Choose a Color:
                        </div>
                                    <SketchPicker
                                        color={this.state.color.hex}
                                        onChange={this.onColorChange}
                                    // onChangeComplete={ this.handleChangeComplete }
                                    />
                                    {/* <input type="text" name='username' className={`form-control ${this.state.usernameErrors.length > 0 ? 'is-invalid' : 'is-valid'}`} value={this.state.username} onChange={this.handleChange} autoComplete="off" />
                                        {this.state.usernameErrors.length > 0 ? (
                                            this.state.usernameErrors.map((element, index) => (
                                                <p key={index} className='errorClass'>
                                                    {element}
                                                </p>
                                            ))
                                        ) : null} */}
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
        )
    }
}

export default withRouter(ChooseProperties);