import React, { Component } from "react";
import '../css/register.css';
import logo from '../images/PandoChat_200x200.png';
import axios from 'axios';
import { withRouter } from "react-router";
import { SketchPicker } from 'react-color';
import Message from '../components/Message';
import profileImage from '../images/profileImage.jpg'



class About extends Component {
    constructor() {
        super();

        this.state = {

        }

    };

    render() {
        return (
            <div className='centeredAbsolute' style={{ position: "absolute" }}>
                <div className='row' id='whiteWindow' style={{
                    width: '75vw'
                }}>
                    <div className='col m-3'>
                        <div className='row justify-content-center'>
                            <img alt='chatter logo' src={logo}></img>
                        </div>
                        <div className='row justify-content-center'>
                            <h2>
                                So, what is PandoChat, anyway?
                            </h2>
                        </div>
                        <div className='row m-4'>
                            <div className='col'>
                                <p>
                                    PandoChat is a response to the plethora of high-volume chat implementations around the internet that simply cannot foster a meaningful conversation between their users because of their antiquated user interface.
                                </p><p>
                                    PandoChat is an experiment to test a suite of tools and strategies to make high-volume chat interfaces easier to read and faster to interact with.
                                </p><p>
                                    Right now, It's just a single "root," thread, but eventually, I'd like to scale it to be able to handle multiple rooms that are dynamically created from the most popular conversations in the root thread.
                                </p><p>
                                    PandoChat is built on the MERN stack, using MongoDB, express, React, and node, all hosted on Heroku.
                            </p>
                            </div>
                            <div className='col'>
                                <div className='row justify-content-center'>
                                    <img src={profileImage} />
                                </div>
                            </div>
                        </div>
                        <div className='row m-4 justify-content-center'>
                            Like what you see? Help make this site better by donating!
                        </div>
                    </div>
                </div>
            </div>)
    }
}

export default withRouter(About);