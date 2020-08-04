import React, { Component } from "react";
import '../css/register.css';
import axios from 'axios';
import { withRouter } from "react-router";



class AdminConsole extends Component {
    constructor() {
        super();

        this.state = {
            chatSimOn: false
        }

        this.handleChatSim = this.handleChatSim.bind(this);

    };

    componentDidMount() {
        //this is where we will get the state of the admin parameters

        axios.get('/admin/chatsim').then(response => {
            console.log(response);
            this.setState({ chatSimOn: response.data });
        });
    }

    handleChatSim() {

        if (this.state.chatSimOn) {
            axios.get('/admin/chatsim/off').then((response) => {
                this.setState({
                    chatSimOn: false
                });
            });
        } else {
            axios.get('/admin/chatsim/on').then((response) => {
                this.setState({
                    chatSimOn: true
                });
            });
        }
    }

    render() {
        return (
            <div className='centeredAbsolute' style={{ position: "absolute" }}>
                <div className='row' id='whiteWindow' style={{
                    width: '75vw'
                }}>
                    <div className='col p-5'>
                        <div className='row'>
                            <div className='col justify-content-right'>
                                <button className='btn btn-secondary' onClick={this.handleChatSim} >
                                    Chat Simulator
                                </button>
                            </div>
                                {this.state.chatSimOn ? <div className='col justify-content-left align-content-center' style={{ backgroundColor: "green" }}>ON</div> : <div className='col justify-content-left align-content-center' style={{ backgroundColor: "red" }}>OFF</div>}
                        </div>
                    </div>
                </div>
            </div>)
    }
}

export default withRouter(AdminConsole);