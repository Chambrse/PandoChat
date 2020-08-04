import React, { Component } from "react";
import logo from '../images/PandoChat_200x200.png';
import { withRouter } from "react-router";

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
                        <div className='row m-4' style={{ overflowY: "scroll", height: '500px'}}>
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

                            <h4>Design philosophy</h4>

                            <h5>The problem</h5>

                            <p>Around the net, you've probably seen a chat interface and the general idea has remained the same for decades. Step 1: there is a message input box. Step 2: Each message is added to the bottom of the feed, and older messages are pushed up to make room. Step 3: Profit?</p>

                            <p>While this might work quite well for most implementations and, admittedly, most modern chat implementations have more to offer than the caricature I've describes, there is one situation in which they all fall short: high volume</p>

                            <p> If you're receiving more than a couple of messages a second - like on a live stream with a large audience, for example - the feed becomes hard to read. If you try to click on a message to reply, you might end up clicking the one below it because it's been pushed up. If you can manage to reply to a message, it will get lost in the barrage of emojis and no real conversation can be had. Enter: PandoChat.</p>
                            
                            <h5>The Solution</h5>

                            <p>While I plan to experiment with many UI techniques if this project gains traction, there are a few basic tenets I'm starting with:</p>

                            <p> A user should be able to easily reply to another user, and track their conversation easily amongst the sea of other messages.</p>

                            <p> Messages should not move around frantically. They should stay put as long as possible so that they're easier to read or skim through or click on.</p>

                            <p>The user should be able to perform all interface interactions without leaving the keyboard. This way, they can spend less time fumbling with the interface and more time typing.</p>

                            <h5>The Goal</h5>

                            <p>This is mostly just an experiment and a way to keep my coding muscles conditioned, but if there is enough interest in unique chat interfaces, I will definitely invest more time into this. It's fun! Eventually, I imagine collecting the best tools from this experiment, and incorporating them into a chat SaaS that can be implemented on other websites!</p>

                            </div>
                            {/* <div className='col'>
                                <div className='row justify-content-center'>
                                    <img src={profileImage} />
                                </div>
                            </div> */}
                        </div>
                        {/* <div className='row m-4 justify-content-center'>
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

                        </div> */}
                    </div>
                </div>
                {/* <ins className="adsbygoogle"
                    style={{display:'block'}}
                    data-ad-client="ca-pub-4385272176217965"
                    data-ad-slot="1784987984"
                    data-ad-format="auto"
                    data-full-width-responsive="true"></ins> */}
            </div>)
    }
}

export default withRouter(About);