import React, { Component } from "react";
import '../css/register.css';
import { withRouter } from "react-router";
import logoIcon from '../images/PandoChat_IconOnly.png'



class Tutorial extends Component {
    constructor() {
        super();

        this.state = {

        };
    };


    render() {
        return (
            <div className='centeredAbsolute' style={{ position: "absolute" }}>
                <div className='row' id='whiteWindow' style={{
                    width: '75vw'
                }}>
                    <div className='col'>
                        <div className='row p-2'>
                            <div className='col-1 mt-2'>
                                <img alt='PandoChat Logo' src={logoIcon} id="PandoLogo"></img>
                            </div>
                            <div className='col-11 mt-2'>
                                <div className='row align-content-center h-100 justify-content-center'>
                                    <h2>Welcome to PandoChat!</h2>
                                </div>
                            </div>
                        </div>
                        <div className='rows'>

                            <h3>The Basics - Controls</h3>

                            <p>Pando Chat has an unusual interface, so in order to make the most of what it has to offer, heed these instructions!</p>

                            <h4>TAB</h4>
                            <p>Cycle through recently received messages. The input is automatically focussed, so once the message you'd like to reply to is highlighted, you can immediately start typing a response.</p>
                            <h4>Left and Right Arrow keys</h4>
                            <p>Scroll the chat window to the left and right to view older messages.</p>
                            <h4>Escape</h4>
                            <p>Deselect messages, and scroll to the end of the chat feed if applicable.</p>
                            <h4>Misc</h4>
                            <p>You can also click on messages to reply to them. Replies will be color coded to more easily follow a conversation.</p>
                            {/* <div id="carouselExampleIndicators" className="carousel slide" data-ride="carousel">
                                <ol className="carousel-indicators">
                                    <li data-target="#carouselExampleIndicators" data-slide-to="0" className="active"></li>
                                    <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
                                    <li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
                                </ol>
                                <div className="carousel-inner">
                                    <div className="carousel-item active">
                                        <img className="d-block w-100" src="https://via.placeholder.com/1000" alt="First slide"></img>
                                    </div>
                                    <div className="carousel-item">
                                        <img className="d-block w-100" src="https://via.placeholder.com/1000" alt="Second slide"></img>
                                    </div>
                                    <div className="carousel-item">
                                        <img className="d-block w-100" src="https://via.placeholder.com/1000" alt="Third slide"></img>
                                    </div>
                                </div>
                                <a className="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
                                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                    <span className="sr-only">Previous</span>
                                </a>
                                <a className="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
                                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                    <span className="sr-only">Next</span>
                                </a>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Tutorial);