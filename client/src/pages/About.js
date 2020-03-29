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

    componentDidMount() {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
    }

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
                        <div className='row m-4 justify-content-center'>
                            <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
                                <input type="hidden" name="cmd" value="_donations" />
                                <input type="hidden" name="business" value="VPXTQWEVEKC36" />
                                <input type="hidden" name="currency_code" value="USD" />
                                <input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif" border="0" name="submit" title="PayPal - The safer, easier way to pay online!" alt="Donate with PayPal button" />
                                <img alt="" border="0" src="https://www.paypal.com/en_US/i/scr/pixel.gif" width="1" height="1" />
                            </form>

                        </div>
                    </div>
                </div>
                <ins className="adsbygoogle"
                    style={{display:'block'}}
                    data-ad-client="ca-pub-4385272176217965"
                    data-ad-slot="1784987984"
                    data-ad-format="auto"
                    data-full-width-responsive="true"></ins>
            </div>)
    }
}

export default withRouter(About);